using AircashSimulator.Configuration;
using DataAccess;
using Microsoft.Extensions.Options;
using Services.HttpRequest;
using System;
using System.Linq;
using AircashSignature;
using System.Threading.Tasks;
using System.Net.Http;
using Newtonsoft.Json;
using Domain.Entities;
using Domain.Entities.Enum;

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
        private AircashSimulatorContext AircashSimulatorContext;
        private IHttpRequestService HttpRequestService;
        private AircashConfiguration AircashConfiguration;

        public AircashPayoutService(AircashSimulatorContext aircashSimulatorContext, IHttpRequestService httpRequestService, IOptionsMonitor<AircashConfiguration> aircashConfiguration)
        {
            AircashSimulatorContext = aircashSimulatorContext;
            HttpRequestService = httpRequestService;
            AircashConfiguration = aircashConfiguration.CurrentValue;
        }

        public async Task<object> CheckUser(string phoneNumber, string partnerUserId, Guid partnerId)
        {
            Response returnResponse = new Response();
            var checkUserResponse = new object();
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == partnerId).FirstOrDefault();
            returnResponse.RequestDateTimeUTC = DateTime.UtcNow;
            var checkUserRequest = new AircashCheckUserRequest()
            {
                PartnerID=partnerId.ToString(),
                PhoneNumber=phoneNumber,
                PartnerUserID=partnerUserId
                
            };
            returnResponse.ServiceRequest = checkUserRequest;
            var sequence = AircashSignatureService.ConvertObjectToString(checkUserRequest);
            returnResponse.Sequence = sequence;
            var signature = AircashSignatureService.GenerateSignature(sequence, partner.PrivateKey, partner.PrivateKeyPass);
            checkUserRequest.Signature = signature;
            var response = await HttpRequestService.SendRequestAircash(checkUserRequest, HttpMethod.Post, $"{AircashConfiguration.M2BaseUrl}{AircashConfiguration.CheckUserEndpoint}");
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
        public async Task<object> CreatePayout(string phoneNumber, decimal amount, Guid partnerUserId, Guid partnerId)
        {
            Response returnResponse = new Response();
            var createPayoutResponse = new object();
            var requestDateTimeUTC = DateTime.UtcNow;
            returnResponse.RequestDateTimeUTC = requestDateTimeUTC;
            var transactionId = Guid.NewGuid();
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == partnerId).FirstOrDefault();
            var createPayoutRequest = new AircashCreatePayoutRequest()
            {
                PartnerID = partnerId.ToString(),
                PartnerTransactionID=transactionId.ToString(),
                Amount=amount,
                PhoneNumber = phoneNumber,
                PartnerUserID = partnerUserId.ToString(),
                CurrencyID=partner.CurrencyId
            };
            returnResponse.ServiceRequest = createPayoutRequest;
            var sequence = AircashSignatureService.ConvertObjectToString(createPayoutRequest);
            returnResponse.Sequence = sequence;
            var signature = AircashSignatureService.GenerateSignature(sequence, partner.PrivateKey, partner.PrivateKeyPass);
            createPayoutRequest.Signature = signature;
            var response = await HttpRequestService.SendRequestAircash(createPayoutRequest, HttpMethod.Post, $"{AircashConfiguration.M2BaseUrl}{AircashConfiguration.CreatePayoutEndpoint}");
            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                var successResponse = JsonConvert.DeserializeObject<AircashCreatePayoutResponse>(response.ResponseContent);
                var responseDateTimeUTC = DateTime.UtcNow;
                returnResponse.ResponseDateTimeUTC = responseDateTimeUTC;
                AircashSimulatorContext.Transactions.Add(new TransactionEntity
                {
                    Amount = amount,
                    ISOCurrencyId = (CurrencyEnum)partner.CurrencyId,
                    PartnerId = partnerId,
                    AircashTransactionId = successResponse.AircashTransactionId,
                    TransactionId = transactionId,
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
                createPayoutResponse = JsonConvert.DeserializeObject<ErrorResponse>(response.ResponseContent);
            }
            returnResponse.ServiceResponse = createPayoutResponse;
            return returnResponse;
        }
        public async Task<object> CheckTransactionStatus(Guid partnerTransactionId)
        {
            Response returnResponse = new Response();
            var checkTransactionStatusResponse = new object();
            var transaction = AircashSimulatorContext.Transactions.Where(x => x.TransactionId == partnerTransactionId).FirstOrDefault();
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == transaction.PartnerId).FirstOrDefault();
            returnResponse.RequestDateTimeUTC = DateTime.UtcNow;
            var checkTransactionStatusRequest = new AircashCheckTransactionStatusRequest()
            {
                PartnerID = transaction.PartnerId.ToString(),
                PartnerTransactionID=partnerTransactionId.ToString(),           
            };
            returnResponse.ServiceRequest = checkTransactionStatusRequest;
            var sequence = AircashSignatureService.ConvertObjectToString(checkTransactionStatusRequest);
            returnResponse.Sequence = sequence;
            var signature = AircashSignatureService.GenerateSignature(sequence, partner.PrivateKey, partner.PrivateKeyPass);
            checkTransactionStatusRequest.Signature = signature;
            var response = await HttpRequestService.SendRequestAircash(checkTransactionStatusRequest, HttpMethod.Post, $"{AircashConfiguration.M2BaseUrl}{AircashConfiguration.CheckTransactionStatusEndpoint}");
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
    }
}
