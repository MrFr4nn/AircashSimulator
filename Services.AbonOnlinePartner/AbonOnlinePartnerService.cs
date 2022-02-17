using System;
using DataAccess;
using System.Linq;
using Domain.Entities;
using System.Net.Http;
using Newtonsoft.Json;
using AircashSignature;
using Domain.Entities.Enum;
using Services.HttpRequest;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using AircashSimulator.Configuration;

namespace Services.AbonOnlinePartner
{
    public class AbonOnlinePartnerService : IAbonOnlinePartnerService
    {
        private AircashSimulatorContext AircashSimulatorContext;
        private IHttpRequestService HttpRequestService;
        private AbonConfiguration AbonConfiguration;

        public AbonOnlinePartnerService(AircashSimulatorContext aircashSimulatorContext, IHttpRequestService httpRequestService, IOptionsMonitor<AbonConfiguration> abonConfiguration)
        {
            AircashSimulatorContext = aircashSimulatorContext;
            HttpRequestService = httpRequestService;
            AbonConfiguration = abonConfiguration.CurrentValue;
        }
        public async Task<object> ValidateCoupon(string couponCode, Guid providerId)
        {
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == providerId).FirstOrDefault();
            var validateCouponResponse = new object();            
            var abonValidateCouponRequest = new AbonValidateCouponRequest
            {
                CouponCode = couponCode,
                ProviderId = providerId
            };
            var dataToSign = AircashSignatureService.ConvertObjectToString(abonValidateCouponRequest);
            var signature = AircashSignatureService.GenerateSignature(dataToSign, partner.PrivateKey, partner.PrivateKeyPass);
            abonValidateCouponRequest.Signature = signature;
            DateTime requestDateTime = DateTime.UtcNow;
            var response = await HttpRequestService.SendRequestAircash(abonValidateCouponRequest, HttpMethod.Post, $"{AbonConfiguration.BaseUrl}{AbonConfiguration.ValidateCouponEndpoint}");
            DateTime responseDateTime = DateTime.UtcNow;
            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                validateCouponResponse = JsonConvert.DeserializeObject<AbonValidateCouponResponse>(response.ResponseContent);
            }
            else
            {
                validateCouponResponse = JsonConvert.DeserializeObject<ErrorResponse>(response.ResponseContent);
            }
            var frontResponse = new Response
            {
                ServiceRequest = abonValidateCouponRequest,
                ServiceResponse = validateCouponResponse,
                Sequence = dataToSign,
                RequestDateTimeUTC = requestDateTime,
                ResponseDateTimeUTC = responseDateTime
            };
            return frontResponse;
        }

        public async Task<object> ConfirmTransaction(string couponCode, Guid userId, Guid providerId)
        {
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == providerId).FirstOrDefault();
            var coupon = AircashSimulatorContext.Coupons.Where(x => x.CouponCode == couponCode).FirstOrDefault();
            var confirmTransactionResponse = new object();
            var providerTransactionId = Guid.NewGuid();
            var abonConfirmTransactionRequest = new AbonConfirmTransactionRequest
            {
                CouponCode = couponCode,
                ProviderId = providerId,
                ProviderTransactionId = providerTransactionId,
                UserId = userId.ToString()
            };
            var dataToSign = AircashSignatureService.ConvertObjectToString(abonConfirmTransactionRequest);
            var signature = AircashSignatureService.GenerateSignature(dataToSign, partner.PrivateKey, partner.PrivateKeyPass);
            abonConfirmTransactionRequest.Signature = signature;
            DateTime requestDateTime = DateTime.UtcNow;
            if (coupon == null)
            {
                return new Response
                {
                    ServiceRequest = abonConfirmTransactionRequest,
                    ServiceResponse = new ErrorResponse { Code = 3, Message = "Invalid coupon code." },
                    Sequence = dataToSign,
                    RequestDateTimeUTC = requestDateTime,
                    ResponseDateTimeUTC = DateTime.UtcNow               
                };
            }
            var response = await HttpRequestService.SendRequestAircash(abonConfirmTransactionRequest, HttpMethod.Post, $"{AbonConfiguration.BaseUrl}{AbonConfiguration.ConfirmTransactionEndpoint}");
            var responseDateTime = DateTime.UtcNow;
            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                var successResponse = JsonConvert.DeserializeObject<AbonConfirmTransactionResponse>(response.ResponseContent);
                var responseDateTimeUTC = DateTime.UtcNow;
                coupon.UsedOnPartnerID = partner.Id;
                coupon.UsedOnUTC = responseDateTimeUTC;
                coupon.UsedAmount = successResponse.CouponValue;
                coupon.UsedCountryIsoCode = partner.CountryCode;
                coupon.UsedCurrency = successResponse.ISOCurrency;
                coupon.UserId = userId.ToString();
                AircashSimulatorContext.Coupons.Update(coupon);
                var newTransaction = new TransactionEntity
                {
                    Amount = successResponse.CouponValue,
                    ISOCurrencyId = successResponse.ISOCurrency,
                    PartnerId = providerId,
                    TransactionId = Guid.NewGuid(),
                    RequestDateTimeUTC = requestDateTime,
                    ResponseDateTimeUTC = DateTime.UtcNow,
                    UserId = userId,
                    ServiceId = ServiceEnum.AbonUsed
                };
                AircashSimulatorContext.Add(newTransaction);
                AircashSimulatorContext.SaveChanges();
                confirmTransactionResponse = successResponse;
            }
            else
            {
                confirmTransactionResponse = JsonConvert.DeserializeObject<ErrorResponse>(response.ResponseContent);
            }
            var frontResponse = new Response
            {
                ServiceRequest = abonConfirmTransactionRequest,
                ServiceResponse = confirmTransactionResponse,
                Sequence = dataToSign,
                RequestDateTimeUTC = requestDateTime,
                ResponseDateTimeUTC = responseDateTime
            };
            return frontResponse;


        }
    }
}
