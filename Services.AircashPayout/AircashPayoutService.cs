using DataAccess;
using Services.HttpRequest;
using System;
using System.Linq;
using AircashSignature;
using System.Threading.Tasks;
using System.Net.Http;
using Newtonsoft.Json;
using Domain.Entities;
using Domain.Entities.Enum;
using Service.Settings;
using System.Collections.Generic;
using Services.Signature;

namespace Services.AircashPayout
{
    public class Response
    {
        public object ServiceRequest { get; set; }
        public object ServiceResponse { get; set; }
        public string Sequence { get; set; }
        public DateTime RequestDateTimeUTC { get; set; }
        public DateTime ResponseDateTimeUTC { get; set; }
    }
    public class AircashPayoutService : IAircashPayoutService
    {
        private ISettingsService SettingsService;
        private AircashSimulatorContext AircashSimulatorContext;
        private IHttpRequestService HttpRequestService;
        private ISignatureService SignatureService;
        private readonly string CheckUserEndpoint = "PartnerV3/CheckUser";
        private readonly string CheckUserV4Endpoint = "PartnerV4/CheckUser";
        private readonly string CreatePayoutV4Endpoint = "PartnerV4/CreatePayout";
        private readonly string CreatePayoutEndpoint = "PartnerV3/CreatePayout";
        private readonly string CheckTransactionStatusEndpoint = "PartnerV2/CheckTransactionStatus";

        public AircashPayoutService(AircashSimulatorContext aircashSimulatorContext, IHttpRequestService httpRequestService, ISettingsService settingsService, ISignatureService signatureService)
        {
            AircashSimulatorContext = aircashSimulatorContext;
            HttpRequestService = httpRequestService;
            SettingsService = settingsService;
            SignatureService = signatureService;
        }

        public async Task<object> CheckUser(string phoneNumber, string partnerUserId, Guid partnerId, EnvironmentEnum environment)
        {
            Response returnResponse = new Response();
            var checkUserResponse = new object();
            returnResponse.RequestDateTimeUTC = DateTime.UtcNow;
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == partnerId).FirstOrDefault();

            var checkUserRequest = GetCheckUserRequest(phoneNumber, partnerUserId, partnerId);
            var sequence = AircashSignatureService.ConvertObjectToString(checkUserRequest);
            checkUserRequest.Signature = checkUserRequest.Signature;
            returnResponse.ServiceRequest = checkUserRequest;
            returnResponse.Sequence = sequence;
            var response = await HttpRequestService.SendRequestAircash(checkUserRequest, HttpMethod.Post, GetCheckUserEndpoint(environment));
            returnResponse.ResponseDateTimeUTC = DateTime.UtcNow;
            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                var successResponse = JsonConvert.DeserializeObject<AircashCheckUserResponse>(response.ResponseContent);
                checkUserResponse=successResponse;
            }
            else
            {
                //checkUserResponse = JsonConvert.DeserializeObject<ErrorResponse>(response.ResponseContent);
            }
            returnResponse.ServiceResponse = checkUserResponse;
            return returnResponse;
        }

        public AircashCheckUserRequest GetCheckUserRequest(string phoneNumber, string partnerUserId, Guid partnerId)
        {

            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == partnerId).FirstOrDefault();

            var checkUserRequest = new AircashCheckUserRequest()
            {
                PartnerID = partnerId.ToString(),
                PhoneNumber = phoneNumber,
                PartnerUserID = partnerUserId

            };
            var sequence = AircashSignatureService.ConvertObjectToString(checkUserRequest);
            var signature = SignatureService.GenerateSignature(partnerId, sequence);
            checkUserRequest.Signature = signature;
             return checkUserRequest;
        }

        public async Task<object> CheckUserV4(string phoneNumber, string partnerUserId, Guid partnerId, List<Parameter> parameters, EnvironmentEnum environment)
        {
            Response returnResponse = new Response();
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == partnerId).FirstOrDefault();
            returnResponse.RequestDateTimeUTC = DateTime.UtcNow;
            var checkUserRequest = GetCheckUserV4Request(phoneNumber,partnerUserId,partnerId,parameters);
            returnResponse.ServiceRequest = checkUserRequest;
            var sequence = AircashSignatureService.ConvertObjectToString(checkUserRequest);
            returnResponse.Sequence = sequence;
            var response = await HttpRequestService.SendRequestAircash(checkUserRequest, HttpMethod.Post, GetCheckUserV4Endpoint(environment));
            returnResponse.ResponseDateTimeUTC = DateTime.UtcNow;
            returnResponse.ServiceResponse = JsonConvert.DeserializeObject<AircashCheckUserResponse>(response.ResponseContent);

            return returnResponse;
        }
        public AircashCheckUserV4Request GetCheckUserV4Request(string phoneNumber, string partnerUserId, Guid partnerId, List<Parameter> parameters)
        {

            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == partnerId).FirstOrDefault();
            var checkUserRequest = new AircashCheckUserV4Request()
            {
                PartnerID = partnerId.ToString(),
                PhoneNumber = phoneNumber,
                PartnerUserID = partnerUserId,
                Parameters = parameters
            };
            var sequence = AircashSignatureService.ConvertObjectToString(checkUserRequest);
            var signature = SignatureService.GenerateSignature(partnerId, sequence);
            checkUserRequest.Signature = signature;
            return checkUserRequest;
        }
        public async Task<object> CreatePayout(string phoneNumber, Guid partnerTransactionId, decimal amount, CurrencyEnum currency, Guid partnerUserId, Guid partnerId, EnvironmentEnum environment)
        {
            
            Response returnResponse = new Response();
            var createPayoutResponse = new object();
            var requestDateTimeUTC = DateTime.UtcNow;
            returnResponse.RequestDateTimeUTC = requestDateTimeUTC;
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == partnerId).FirstOrDefault();
            var createPayoutRequest = GetCreatePayoutRequest(phoneNumber,partnerTransactionId,amount,currency,partnerUserId,partnerId);
            returnResponse.ServiceRequest = createPayoutRequest;
            var sequence = AircashSignatureService.ConvertObjectToString(createPayoutRequest);
            returnResponse.Sequence = sequence;
            var response = await HttpRequestService.SendRequestAircash(createPayoutRequest, HttpMethod.Post, GetCreatePayoutEndpoint(environment));
            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                var successResponse = JsonConvert.DeserializeObject<AircashCreatePayoutResponse>(response.ResponseContent);
                var responseDateTimeUTC = DateTime.UtcNow;
                returnResponse.ResponseDateTimeUTC = responseDateTimeUTC;
                AircashSimulatorContext.Transactions.Add(new TransactionEntity
                {
                    Amount = amount,
                    ISOCurrencyId = currency,
                    PartnerId = partnerId,
                    AircashTransactionId = successResponse.AircashTransactionId,
                    TransactionId = partnerTransactionId,
                    ServiceId = ServiceEnum.AircashPayout,
                    UserId = partnerUserId,
                    RequestDateTimeUTC = requestDateTimeUTC,
                    ResponseDateTimeUTC = responseDateTimeUTC                    
                });
                AircashSimulatorContext.SaveChanges();
                createPayoutResponse = successResponse;
            }
            else
            {
                returnResponse.ResponseDateTimeUTC = DateTime.UtcNow;
                createPayoutResponse = JsonConvert.DeserializeObject<ErrorResponse>(response.ResponseContent);
            }
            returnResponse.ServiceResponse = createPayoutResponse;
            return returnResponse;
        }
        public AircashCreatePayoutRequest GetCreatePayoutRequest(string phoneNumber, Guid partnerTransactionId, decimal amount, CurrencyEnum currency, Guid partnerUserId, Guid partnerId)
        { 
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == partnerId).FirstOrDefault();
            var createPayoutRequest = new AircashCreatePayoutRequest()
            {
                PartnerID = partnerId.ToString(),
                PartnerTransactionID = partnerTransactionId.ToString(),
                Amount = amount,
                PhoneNumber = phoneNumber,
                PartnerUserID = partnerUserId.ToString(),
                CurrencyID = (int)currency
            };
            var sequence = AircashSignatureService.ConvertObjectToString(createPayoutRequest);
            var signature = SignatureService.GenerateSignature(partnerId, sequence);
            createPayoutRequest.Signature = signature;
            return createPayoutRequest;
        }



        public async Task<object> CreatePayoutV4(string phoneNumber, Guid partnerTransactionId, decimal amount, CurrencyEnum currency, Guid partnerUserId, Guid partnerId, List<Parameter> parameters, EnvironmentEnum environment)
        {
            
            Response returnResponse = new Response();
            var createPayoutResponse = new object();
            var requestDateTimeUTC = DateTime.UtcNow;
            returnResponse.RequestDateTimeUTC = requestDateTimeUTC;
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == partnerId).FirstOrDefault();
            var createPayoutRequest =  GetCreatePayoutV4Request(phoneNumber,partnerTransactionId,amount,currency,partnerUserId,partnerId,parameters);
            returnResponse.ServiceRequest = createPayoutRequest;
            var sequence = AircashSignatureService.ConvertObjectToString(createPayoutRequest);
            returnResponse.Sequence = sequence;
            var signature = SignatureService.GenerateSignature(partnerId, sequence);
            var response = await HttpRequestService.SendRequestAircash(createPayoutRequest, HttpMethod.Post,GetCreatePayoutV4Endpoint(environment));
            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                var successResponse = JsonConvert.DeserializeObject<AircashCreatePayoutResponse>(response.ResponseContent);
                var responseDateTimeUTC = DateTime.UtcNow;
                returnResponse.ResponseDateTimeUTC = responseDateTimeUTC;
                AircashSimulatorContext.Transactions.Add(new TransactionEntity
                {
                    Amount = amount,
                    ISOCurrencyId = currency,
                    PartnerId = partnerId,
                    AircashTransactionId = successResponse.AircashTransactionId,
                    TransactionId = partnerTransactionId,
                    ServiceId = ServiceEnum.AircashPayout,
                    UserId = partnerUserId,
                    RequestDateTimeUTC = requestDateTimeUTC,
                    ResponseDateTimeUTC = responseDateTimeUTC                    
                });
                AircashSimulatorContext.SaveChanges();
                createPayoutResponse = successResponse;
            }
            else
            {
                returnResponse.ResponseDateTimeUTC = DateTime.UtcNow;
                createPayoutResponse = JsonConvert.DeserializeObject<ErrorResponse>(response.ResponseContent);
            }
            returnResponse.ServiceResponse = createPayoutResponse;
            return returnResponse;
        }
        public AircashCreatePayoutV4Request GetCreatePayoutV4Request(string phoneNumber, Guid partnerTransactionId, decimal amount, CurrencyEnum currency, Guid partnerUserId, Guid partnerId, List<Parameter> parameters)
        {
                var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == partnerId).FirstOrDefault();
            var createPayoutRequest = new AircashCreatePayoutV4Request()
            {
                PartnerID = partnerId.ToString(),
                PartnerTransactionID = partnerTransactionId.ToString(),
                Amount = amount,
                PhoneNumber = phoneNumber,
                PartnerUserID = partnerUserId.ToString(),
                CurrencyID = (int)currency,
                Parameters = parameters,

            };
            var sequence = AircashSignatureService.ConvertObjectToString(createPayoutRequest);
            var signature = SignatureService.GenerateSignature(partnerId, sequence);
            createPayoutRequest.Signature = signature;

            return createPayoutRequest;
        }


        public async Task<object> CheckTransactionStatus(Guid partnerTransactionId, EnvironmentEnum environment)
        {
            Response returnResponse = new Response();
            var checkTransactionStatusResponse = new object();
            var checkTransactionStatusRequest = GetCheckTransactionStatusRequest(partnerTransactionId);
            var transaction = AircashSimulatorContext.Transactions.Where(x => x.TransactionId == partnerTransactionId).FirstOrDefault();
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == transaction.PartnerId).FirstOrDefault();
            returnResponse.RequestDateTimeUTC = DateTime.UtcNow;
            returnResponse.ServiceRequest = checkTransactionStatusRequest;
            var sequence = AircashSignatureService.ConvertObjectToString(checkTransactionStatusRequest);
            returnResponse.Sequence = sequence;
            var signature = SignatureService.GenerateSignature(transaction.PartnerId, sequence);
            checkTransactionStatusRequest.Signature = signature;
            var response = await HttpRequestService.SendRequestAircash(checkTransactionStatusRequest, HttpMethod.Post, GetCheckTransactionStatusEndpoint(environment));
            returnResponse.ResponseDateTimeUTC = DateTime.UtcNow;
            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                var successResponse = JsonConvert.DeserializeObject<AircashCheckTransactionStatusResponse>(response.ResponseContent);
                checkTransactionStatusResponse = successResponse;
            }
            else
            {
                checkTransactionStatusResponse = JsonConvert.DeserializeObject<ErrorResponse>(response.ResponseContent);
            }
            returnResponse.ServiceResponse = checkTransactionStatusResponse;
            return returnResponse;
        }
        public AircashCheckTransactionStatusRequest GetCheckTransactionStatusRequest(Guid partnerTransactionId)
        {
            var checkTransactionStatusResponse = new object();
            var transaction = AircashSimulatorContext.Transactions.Where(x => x.TransactionId == partnerTransactionId).FirstOrDefault();
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == transaction.PartnerId).FirstOrDefault();
       
            var checkTransactionStatusRequest = new AircashCheckTransactionStatusRequest()
            {
                PartnerID = transaction.PartnerId.ToString(),
                PartnerTransactionID = partnerTransactionId.ToString(),
            };
            var sequence = AircashSignatureService.ConvertObjectToString(checkTransactionStatusRequest);
            var signature = SignatureService.GenerateSignature(transaction.PartnerId, sequence);
            checkTransactionStatusRequest.Signature = signature;
            return checkTransactionStatusRequest;
        }
        public string GetCheckTransactionStatusEndpoint(EnvironmentEnum environment)
        {
            return $"{HttpRequestService.GetEnvironmentBaseUri(environment, EndpointEnum.M2)}{CheckTransactionStatusEndpoint}";
        }

        public string GetCheckUserEndpoint(EnvironmentEnum environment)
        {
            return $"{HttpRequestService.GetEnvironmentBaseUri(environment, EndpointEnum.M2)}{CheckUserEndpoint}";
        }
        public string GetCheckUserV4Endpoint(EnvironmentEnum environment)
        {
            return $"{HttpRequestService.GetEnvironmentBaseUri(environment, EndpointEnum.M2)}{CheckUserV4Endpoint}";
        }
        public string GetCreatePayoutEndpoint(EnvironmentEnum environment)
        {
            return $"{HttpRequestService.GetEnvironmentBaseUri(environment, EndpointEnum.M2)}{CreatePayoutEndpoint}";
        }
        public string GetCreatePayoutV4Endpoint(EnvironmentEnum environment)
        {
            return $"{HttpRequestService.GetEnvironmentBaseUri(environment, EndpointEnum.M2)}{CreatePayoutV4Endpoint}";
        }
       
    }
}
