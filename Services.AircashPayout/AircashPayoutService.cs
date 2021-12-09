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
            var checkUserResponse = new object();
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == partnerId).FirstOrDefault();
            var checkUserRequest = new AircashCheckUserRequest()
            {
                PartnerID=partnerId.ToString(),
                PhoneNumber=phoneNumber,
                PartnerUserID=partnerUserId
                
            };
            var sequence = AircashSignatureService.ConvertObjectToString(checkUserRequest);
            var signature = AircashSignatureService.GenerateSignature(sequence, partner.PrivateKey, partner.PrivateKeyPass);
            checkUserRequest.Signature = signature;
            var response = await HttpRequestService.SendRequestAircash(checkUserRequest, HttpMethod.Post, $"{AircashConfiguration.M2BaseUrl}{AircashConfiguration.CheckUserEndpoint}");
            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                var successResponse = JsonConvert.DeserializeObject<AircashCheckUserResponse>(response.ResponseContent);
                checkUserResponse=successResponse;
            }
            else
            {
                //checkUserResponse = JsonConvert.DeserializeObject<ErrorResponse>(response.ResponseContent);
            }
            return checkUserResponse;
        }
        public async Task<object> CreatePayout(string phoneNumber, decimal amount, Guid partnerUserId, Guid partnerId)
        {
            var createPayoutResponse = new object();
            var requestDateTimeUTC = DateTime.UtcNow;
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
            var sequence = AircashSignatureService.ConvertObjectToString(createPayoutRequest);
            var signature = AircashSignatureService.GenerateSignature(sequence, partner.PrivateKey, partner.PrivateKeyPass);
            createPayoutRequest.Signature = signature;
            var response = await HttpRequestService.SendRequestAircash(createPayoutRequest, HttpMethod.Post, $"{AircashConfiguration.M2BaseUrl}{AircashConfiguration.CreatePayoutEndpoint}");
            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                var successResponse = JsonConvert.DeserializeObject<AircashCreatePayoutResponse>(response.ResponseContent);
                var responseDateTimeUTC = DateTime.UtcNow;
                AircashSimulatorContext.Transactions.Add(new TransactionEntity
                {
                    Amount = amount,
                    ISOCurrencyId = (CurrencyEnum)partner.CurrencyId,
                    PartnerId = partnerId,
                    AircashTransactionId = successResponse.AircashTransactionId,
                    TransactionId = transactionId,
                    ServiceId = ServiceEnum.AircashPayment,
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
            return createPayoutResponse;
        }
        public async Task<object> CheckTransactionStatus(Guid partnerTransactionId)
        {
            var checkTransactionStatusResponse = new object();
            var transaction = AircashSimulatorContext.Transactions.Where(x => x.TransactionId == partnerTransactionId).FirstOrDefault();
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == transaction.PartnerId).FirstOrDefault();
            var checkTransactionStatusRequest = new AircashCheckTransactionStatusRequest()
            {
                PartnerID = transaction.PartnerId.ToString(),
                PartnerTransactionID=partnerTransactionId.ToString(),           
            };
            var sequence = AircashSignatureService.ConvertObjectToString(checkTransactionStatusRequest);
            var signature = AircashSignatureService.GenerateSignature(sequence, partner.PrivateKey, partner.PrivateKeyPass);
            checkTransactionStatusRequest.Signature = signature;
            var response = await HttpRequestService.SendRequestAircash(checkTransactionStatusRequest, HttpMethod.Post, $"{AircashConfiguration.M2BaseUrl}{AircashConfiguration.CheckTransactionStatusEndpoint}");
            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                var successResponse = JsonConvert.DeserializeObject<AircashCheckTransactionStatusResponse>(response.ResponseContent);
                checkTransactionStatusResponse = successResponse;
            }
            else
            {
                //checkUserResponse = JsonConvert.DeserializeObject<ErrorResponse>(response.ResponseContent);
            }
            return checkTransactionStatusResponse;
        }
    }
}
