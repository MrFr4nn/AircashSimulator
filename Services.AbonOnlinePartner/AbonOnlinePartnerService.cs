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

namespace Services.AbonOnlinePartner
{
    public class AbonOnlinePartnerService : IAbonOnlinePartnerService
    {
        private AircashSimulatorContext AircashSimulatorContext;
        private IHttpRequestService HttpRequestService;

        private readonly string ValidateCouponEndpoint = "OnlineProvider/ValidateCoupon";
        private readonly string ConfirmTransactionEndpoint = "OnlineProvider/ConfirmTransaction";

        public AbonOnlinePartnerService(AircashSimulatorContext aircashSimulatorContext, IHttpRequestService httpRequestService)
        {
            AircashSimulatorContext = aircashSimulatorContext;
            HttpRequestService = httpRequestService;
        }
        public async Task<object> ValidateCoupon(string couponCode, Guid providerId, string partnerPrivateKey, string partnerPrivateKeyPass, EnvironmentEnum environment)
        {
            var validateCouponResponse = new object();
            var abonValidateCouponRequest = new AbonValidateCouponRequest
            {
                CouponCode = couponCode,
                ProviderId = providerId
            };
            var dataToSign = AircashSignatureService.ConvertObjectToString(abonValidateCouponRequest);
            var signature = AircashSignatureService.GenerateSignature(dataToSign, partnerPrivateKey, partnerPrivateKeyPass);
            abonValidateCouponRequest.Signature = signature;
            DateTime requestDateTime = DateTime.UtcNow;
            var url = $"{HttpRequestService.GetEnvironmentBaseUri(environment, EndpointEnum.Abon)}{ValidateCouponEndpoint}";
            var response = await HttpRequestService.SendRequestAircash(abonValidateCouponRequest, HttpMethod.Post, $"{HttpRequestService.GetEnvironmentBaseUri(environment, EndpointEnum.Abon)}{ValidateCouponEndpoint}");
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

        public async Task<object> ConfirmTransaction(string couponCode, Guid userId, Guid providerId, string partnerPrivateKey, string partnerPrivateKeyPass, EnvironmentEnum environment)
        {
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == providerId).FirstOrDefault();
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
            var signature = AircashSignatureService.GenerateSignature(dataToSign, partnerPrivateKey, partnerPrivateKeyPass);
            abonConfirmTransactionRequest.Signature = signature;
            DateTime requestDateTime = DateTime.UtcNow;
            
            var response = await HttpRequestService.SendRequestAircash(abonConfirmTransactionRequest, HttpMethod.Post, $"{HttpRequestService.GetEnvironmentBaseUri(environment , EndpointEnum.Abon)}{ConfirmTransactionEndpoint}");
            var responseDateTime = DateTime.UtcNow;
            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                var successResponse = JsonConvert.DeserializeObject<AbonConfirmTransactionResponse>(response.ResponseContent);
                var responseDateTimeUTC = DateTime.UtcNow;
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
    }
}
