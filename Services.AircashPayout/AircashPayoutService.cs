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
        private readonly string CheckUserEndpoint = "PartnerV3/CheckUser";
        private readonly string CreatePayoutEndpoint = "PartnerV3/CreatePayout";
        private readonly string CheckTransactionStatusEndpoint = "PartnerV2/CheckTransactionStatus";

        public AircashPayoutService(AircashSimulatorContext aircashSimulatorContext, IHttpRequestService httpRequestService, ISettingsService settingsService)
        {
            AircashSimulatorContext = aircashSimulatorContext;
            HttpRequestService = httpRequestService;
            SettingsService = settingsService;
        }

        public async Task<object> CheckUser(string phoneNumber, string partnerUserId, Guid partnerId, EnvironmentEnum environment)
        {
            Response returnResponse = new Response();
            var checkUserResponse = new object();
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == partnerId).FirstOrDefault();
            returnResponse.RequestDateTimeUTC = DateTime.UtcNow;

            var checkUserRequest = GetCheckUserRequest(phoneNumber, partnerUserId, partnerId);
            returnResponse.ServiceRequest = checkUserRequest;
            var sequence = AircashSignatureService.ConvertObjectToString(checkUserRequest);
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
            var signature = AircashSignatureService.GenerateSignature(sequence, partner.PrivateKey, partner.PrivateKeyPass);
            checkUserRequest.Signature = signature;
            return checkUserRequest;
        }
        public string GetCheckUserEndpoint(EnvironmentEnum environment)
        {
           return $"{HttpRequestService.GetEnvironmentBaseUri(environment, EndpointEnum.M2)}{CheckUserEndpoint}";
        }
        public async Task<object> CreatePayout(string phoneNumber, Guid partnerTransactionId, decimal amount, CurrencyEnum currency, Guid partnerUserId, Guid partnerId, EnvironmentEnum environment)

        {
            Response returnResponse = new Response();
            var createPayoutResponse = new object();
            var requestDateTimeUTC = DateTime.UtcNow;
            returnResponse.RequestDateTimeUTC = requestDateTimeUTC;
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == partnerId).FirstOrDefault();
            var createPayoutRequest = GetCreatePayoutRequest(phoneNumber, amount, partnerUserId, partnerId);
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
        public AircashCreatePayoutRequest GetCreatePayoutRequest(string phoneNumber, decimal amount, Guid partnerUserId, Guid partnerId)
        {

            var transactionId = Guid.NewGuid();
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == partnerId).FirstOrDefault();
            var createPayoutRequest = new AircashCreatePayoutRequest()
            {
                PartnerID = partnerId.ToString(),
                PartnerTransactionID = transactionId.ToString(),
                Amount = amount,
                PhoneNumber = phoneNumber,
                PartnerUserID = partnerUserId.ToString(),
                CurrencyID = partner.CurrencyId
            };
            var sequence = AircashSignatureService.ConvertObjectToString(createPayoutRequest);
            var signature = AircashSignatureService.GenerateSignature(sequence, partner.PrivateKey, partner.PrivateKeyPass);
            createPayoutRequest.Signature = signature;
            return createPayoutRequest;
        }

        public string GetCreatePayoutEndpoint(EnvironmentEnum environment)
        {
            return $"{HttpRequestService.GetEnvironmentBaseUri(environment, EndpointEnum.M2)}{CreatePayoutEndpoint}";
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
            var signature = AircashSignatureService.GenerateSignature(sequence, SettingsService.AircashSimulatorPrivateKeyPath, SettingsService.AircashSimulatorPrivateKeyPass);
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
            var signature = AircashSignatureService.GenerateSignature(sequence, partner.PrivateKey, partner.PrivateKeyPass);
            checkTransactionStatusRequest.Signature = signature;
            return checkTransactionStatusRequest;
        }
        public string GetCheckTransactionStatusEndpoint(EnvironmentEnum environment)
        {
            return $"{HttpRequestService.GetEnvironmentBaseUri(environment, EndpointEnum.M2)}{CheckTransactionStatusEndpoint}";
        }
    }
}
