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
using Services.Signature;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace Services.AbonOnlinePartner
{
    public class AbonOnlinePartnerService : IAbonOnlinePartnerService
    {
        private AircashSimulatorContext AircashSimulatorContext;
        private IHttpRequestService HttpRequestService;
        private ISignatureService SignatureService;

        private readonly string ValidateCouponEndpoint = "OnlineProvider/ValidateCoupon";
        private readonly string ConfirmTransactionEndpoint = "OnlineProvider/ConfirmTransaction";

        public AbonOnlinePartnerService(AircashSimulatorContext aircashSimulatorContext, IHttpRequestService httpRequestService, ISignatureService signatureService)
        {
            AircashSimulatorContext = aircashSimulatorContext;
            HttpRequestService = httpRequestService;
            SignatureService = signatureService;
        }
        public async Task<object> ValidateCoupon(string couponCode, string providerId, string partnerPrivateKey, string partnerPrivateKeyPass, EnvironmentEnum environment)
        {
            var validateCouponResponse = new object();
            var abonValidateCouponRequest = GetValidateCouponRequest(couponCode, providerId, partnerPrivateKey, partnerPrivateKeyPass);
            var dataToSign = AircashSignatureService.ConvertObjectToString(abonValidateCouponRequest);
            DateTime requestDateTime = DateTime.UtcNow;
            var response = await HttpRequestService.SendRequestAircash(abonValidateCouponRequest, HttpMethod.Post, GetValidateCouponEndpoint(environment));
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
        public AbonValidateCouponRequest GetValidateCouponRequest(string couponCode, string providerId, string partnerPrivateKey, string partnerPrivateKeyPass)
        {
            var abonValidateCouponRequest = new AbonValidateCouponRequest
            {
                CouponCode = couponCode,
                ProviderId = providerId
            };

            var dataToSign = AircashSignatureService.ConvertObjectToString(abonValidateCouponRequest);
            string signature;
            if (partnerPrivateKey != null)
            {
                signature = AircashSignatureService.GenerateSignature(dataToSign, partnerPrivateKey, partnerPrivateKeyPass);
            }
            else
            {
                signature = SignatureService.GenerateSignature(new Guid(providerId), dataToSign);
            }
            abonValidateCouponRequest.Signature = signature;
            return abonValidateCouponRequest;
        }
        public string GetValidateCouponEndpoint(EnvironmentEnum environment)
        {
            return $"{HttpRequestService.GetEnvironmentBaseUri(environment, EndpointEnum.Abon)}{ValidateCouponEndpoint}";
        }
        public async Task<object> ConfirmTransaction(string couponCode, string phoneNumber, string providerId, string providerTransactionId, string userId, string partnerPrivateKey, string partnerPrivateKeyPass, EnvironmentEnum environment)
        {
            var confirmTransactionResponse = new object();
            var abonConfirmTransactionRequest = GetConfirmTransactionRequest(couponCode, phoneNumber, userId, providerId, providerTransactionId, partnerPrivateKey, partnerPrivateKeyPass);
            var dataToSign = AircashSignatureService.ConvertObjectToString(abonConfirmTransactionRequest);
            DateTime requestDateTime = DateTime.UtcNow;

            var response = await HttpRequestService.SendRequestAircash(abonConfirmTransactionRequest, HttpMethod.Post, GetConfirmTransactionEndpoint(environment));
            var responseDateTime = DateTime.UtcNow;
            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                var successResponse = JsonConvert.DeserializeObject<AbonConfirmTransactionResponse>(response.ResponseContent);
                var responseDateTimeUTC = DateTime.UtcNow;
                var newTransaction = new TransactionEntity
                {
                    Amount = successResponse.CouponValue,
                    ISOCurrencyId = successResponse.ISOCurrency,
                    PartnerId = new Guid(providerId),
                    TransactionId = Guid.NewGuid().ToString(),
                    RequestDateTimeUTC = requestDateTime,
                    ResponseDateTimeUTC = DateTime.UtcNow,
                    UserId = userId,
                    ServiceId = ServiceEnum.AbonUsed
                };
                AircashSimulatorContext.Add(newTransaction);
                confirmTransactionResponse = successResponse;
                AircashSimulatorContext.SaveChanges();
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
        public AbonConfirmTransactionRequest GetConfirmTransactionRequest(string couponCode, string phoneNumber, string userId, string providerId, string providerTransactionId, string partnerPrivateKey, string partnerPrivateKeyPass)
        {
            var abonConfirmTransactionRequest = new AbonConfirmTransactionRequest
            {
                CouponCode = couponCode,
                PhoneNumber = phoneNumber,
                ProviderId = providerId,
                ProviderTransactionId = providerTransactionId,
                UserId = userId.ToString()
            };
            var dataToSign = AircashSignatureService.ConvertObjectToString(abonConfirmTransactionRequest);
            string signature;
            if (partnerPrivateKey != null)
            {
                signature = AircashSignatureService.GenerateSignature(dataToSign, partnerPrivateKey, partnerPrivateKeyPass);
            }
            else
            {
                signature = SignatureService.GenerateSignature(new Guid(providerId), dataToSign);
            }
            abonConfirmTransactionRequest.Signature = signature;
            DateTime requestDateTime = DateTime.UtcNow;
            return abonConfirmTransactionRequest;

        }
        public string GetConfirmTransactionEndpoint(EnvironmentEnum environment)
        {
            return $"{HttpRequestService.GetEnvironmentBaseUri(environment, EndpointEnum.Abon)}{ConfirmTransactionEndpoint}";
        }
    }
}

