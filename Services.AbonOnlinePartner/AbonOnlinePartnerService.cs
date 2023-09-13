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
using System.Collections.Generic;

namespace Services.AbonOnlinePartner
{
    public class AbonOnlinePartnerService : IAbonOnlinePartnerService
    {
        private AircashSimulatorContext AircashSimulatorContext;
        private IHttpRequestService HttpRequestService;
        private ISignatureService SignatureService;

        private readonly string ValidateCouponEndpoint = "OnlineProvider/ValidateCoupon";
        private readonly string CheckStatusCouponEndpoint = "ConsumeBon/CheckStatus";
        private readonly string ConfirmTransactionEndpoint = "OnlineProvider/ConfirmTransaction";
        private readonly string ConfirmTransactionV2Endpoint = "ConsumeBon/ConfirmTransaction";

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
        public async Task<object> CheckStatusCoupon(string partnerId, string couponCode, string partnerTransactionId, string notificationUrl, string userId, string userPhoneNumber, List<AbonCheckStatusCouponParameters> parameters, string partnerPrivateKey, string partnerPrivateKeyPass, EnvironmentEnum environment)
        {
            var checkStausCouponResponse = new object();
            var abonCheckStatusCouponRequest = GetCheckStatusCouponRequest(partnerId, couponCode, partnerTransactionId, notificationUrl, userId, userPhoneNumber, parameters, partnerPrivateKey, partnerPrivateKeyPass);
            var dataToSign = AircashSignatureService.ConvertObjectToString(abonCheckStatusCouponRequest);
            DateTime requestDateTime = DateTime.UtcNow;
            var response = await HttpRequestService.SendRequestAircash(abonCheckStatusCouponRequest, HttpMethod.Post, GetCheckStatusCouponEndpoint(environment));
            DateTime responseDateTime = DateTime.UtcNow;
            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                checkStausCouponResponse = JsonConvert.DeserializeObject<AbonCheckStatusCouponResponse>(response.ResponseContent);
            }
            else
            {
                checkStausCouponResponse = JsonConvert.DeserializeObject<ErrorResponseV2>(response.ResponseContent);
            }
            var frontResponse = new Response
            {
                ServiceRequest = abonCheckStatusCouponRequest,
                ServiceResponse = checkStausCouponResponse,
                Sequence = dataToSign,
                RequestDateTimeUTC = requestDateTime,
                ResponseDateTimeUTC = responseDateTime
            };
            return frontResponse;
        }
        public AbonCheckStatusCouponRequest GetCheckStatusCouponRequest(string partnerId, string couponCode, string partnerTransactionId, string notificationUrl, string userId, string userPhoneNumber, List<AbonCheckStatusCouponParameters> parameters, string partnerPrivateKey, string partnerPrivateKeyPass)
        {
            var abonChekStatusCouponRequest = new AbonCheckStatusCouponRequest
            {
                PartnerId = partnerId,
                CouponCode = couponCode,
                PartnerTransactionId = partnerTransactionId,
                NotificationUrl = notificationUrl,
                PhoneNumber = userPhoneNumber,
                Parameters = parameters,
                UserId = userId
            };

            var dataToSign = AircashSignatureService.ConvertObjectToString(abonChekStatusCouponRequest);
            string signature;
            if (partnerPrivateKey != null)
            {
                signature = AircashSignatureService.GenerateSignature(dataToSign, partnerPrivateKey, partnerPrivateKeyPass);
            }
            else
            {
                signature = SignatureService.GenerateSignature(new Guid(partnerId), dataToSign);
            }
            abonChekStatusCouponRequest.Signature = signature;
            return abonChekStatusCouponRequest;
        }
        public string GetCheckStatusCouponEndpoint(EnvironmentEnum environment)
        {
            return $"{HttpRequestService.GetEnvironmentBaseUri(environment, EndpointEnum.Abon)}{CheckStatusCouponEndpoint}";
        }
        public async Task<object> ConfirmTransaction(string couponCode, string providerId, string providerTransactionId, string userId, string partnerPrivateKey, string partnerPrivateKeyPass, EnvironmentEnum environment)
        {
            var confirmTransactionResponse = new object();
            var abonConfirmTransactionRequest = GetConfirmTransactionRequest(couponCode, userId, providerId, providerTransactionId, partnerPrivateKey, partnerPrivateKeyPass);
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
                    ISOCurrencyId = (CurrencyEnum)Enum.Parse(typeof(CurrencyEnum), successResponse.ISOCurrency),
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
        public AbonConfirmTransactionRequest GetConfirmTransactionRequest(string couponCode, string userId, string providerId, string providerTransactionId, string partnerPrivateKey, string partnerPrivateKeyPass)
        {
            var abonConfirmTransactionRequest = new AbonConfirmTransactionRequest
            {
                CouponCode = couponCode,
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
        public async Task<object> ConfirmTransactionV2(string couponCode, string partnerId, string partnerTransactionId, string userId, string partnerPrivateKey, string partnerPrivateKeyPass, EnvironmentEnum environment)
        {
            var confirmTransactionV2Response = new object();
            var abonConfirmTransactionV2Request = GetConfirmTransactionV2Request(couponCode, userId, partnerId, partnerTransactionId, partnerPrivateKey, partnerPrivateKeyPass);
            var dataToSign = AircashSignatureService.ConvertObjectToString(abonConfirmTransactionV2Request);
            DateTime requestDateTime = DateTime.UtcNow;

            var response = await HttpRequestService.SendRequestAircash(abonConfirmTransactionV2Request, HttpMethod.Post, GetConfirmTransactionV2Endpoint(environment));
            var responseDateTime = DateTime.UtcNow;
            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                var successResponse = JsonConvert.DeserializeObject<AbonConfirmTransactionV2Response>(response.ResponseContent);
                var responseDateTimeUTC = DateTime.UtcNow;
                var newTransaction = new TransactionEntity
                {
                    Amount = successResponse.CouponValue,
                    ISOCurrencyId = (CurrencyEnum)Enum.Parse(typeof(CurrencyEnum), successResponse.ISOCurrency),
                    PartnerId = new Guid(partnerId),
                    TransactionId = Guid.NewGuid().ToString(),
                    RequestDateTimeUTC = requestDateTime,
                    ResponseDateTimeUTC = DateTime.UtcNow,
                    UserId = userId,
                    ServiceId = ServiceEnum.AbonUsed
                };
                AircashSimulatorContext.Add(newTransaction);
                confirmTransactionV2Response = successResponse;
                AircashSimulatorContext.SaveChanges();
            }
            else
            {
                confirmTransactionV2Response = JsonConvert.DeserializeObject<ErrorResponseV2>(response.ResponseContent);
            }
            var frontResponse = new Response
            {
                ServiceRequest = abonConfirmTransactionV2Request,
                ServiceResponse = confirmTransactionV2Response,
                Sequence = dataToSign,
                RequestDateTimeUTC = requestDateTime,
                ResponseDateTimeUTC = responseDateTime
            };
            return frontResponse;
        }
        public AbonConfirmTransactionV2Request GetConfirmTransactionV2Request(string couponCode, string userId, string partnerId, string partnerTransactionId, string partnerPrivateKey, string partnerPrivateKeyPass)
        {
            var abonConfirmTransactionV2Request = new AbonConfirmTransactionV2Request
            {
                CouponCode = couponCode,
                PartnerId = partnerId,
                PartnerTransactionId = partnerTransactionId,
                UserId = userId.ToString()
            };
            var dataToSign = AircashSignatureService.ConvertObjectToString(abonConfirmTransactionV2Request);
            string signature;
            if (partnerPrivateKey != null)
            {
                signature = AircashSignatureService.GenerateSignature(dataToSign, partnerPrivateKey, partnerPrivateKeyPass);
            }
            else
            {
                signature = SignatureService.GenerateSignature(new Guid(partnerId), dataToSign);
            }
            abonConfirmTransactionV2Request.Signature = signature;
            DateTime requestDateTime = DateTime.UtcNow;
            return abonConfirmTransactionV2Request;

        }
        public string GetConfirmTransactionV2Endpoint(EnvironmentEnum environment)
        {            
            return $"{HttpRequestService.GetEnvironmentBaseUri(environment, EndpointEnum.Abon)}{ConfirmTransactionV2Endpoint}";
        }
    }
}

