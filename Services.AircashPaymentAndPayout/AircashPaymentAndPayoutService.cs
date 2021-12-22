using AircashSignature;
using AircashSimulator.Configuration;
using DataAccess;
using Domain.Entities;
using Domain.Entities.Enum;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Services.HttpRequest;
using System;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace Services.AircashPaymentAndPayout
{
    public class AircashPaymentAndPayoutService : IAircashPaymentAndPayoutService
    {
        private AircashSimulatorContext AircashSimulatorContext;
        private IHttpRequestService HttpRequestService;
        private AircashConfiguration AircashConfiguration;

        public AircashPaymentAndPayoutService(AircashSimulatorContext aircashSimulatorContext, IHttpRequestService httpRequestService, IOptionsMonitor<AircashConfiguration> aircashConfiguration)
        {
            AircashSimulatorContext = aircashSimulatorContext;
            HttpRequestService = httpRequestService;
            AircashConfiguration = aircashConfiguration.CurrentValue;
        }

        public async Task<object> CheckCode(string barCode, string locationID, Guid partnerId) 
        {
            var checkCodeResponse = new object();
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == partnerId).FirstOrDefault();
            var requestDateTimeUTC = DateTime.UtcNow;
            //var transactionId = Guid.NewGuid();
            var checkCodeRequest = new CheckCodeRequest()
            {
                PartnerID = partnerId.ToString(),
                BarCode = barCode,
                LocationID = locationID           
            };
            var sequence = AircashSignatureService.ConvertObjectToString(checkCodeRequest);
            var signature = AircashSignatureService.GenerateSignature(sequence, partner.PrivateKey, partner.PrivateKeyPass);
            checkCodeRequest.Signature = signature;
            var response = await HttpRequestService.SendRequestAircash(checkCodeRequest, HttpMethod.Post, $"{AircashConfiguration.M2BaseUrl}"+$"{AircashConfiguration.CheckCodeEndpoint}");
            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                checkCodeResponse= JsonConvert.DeserializeObject<CheckCodeResponse>(response.ResponseContent);
                var responseDateTimeUTC = DateTime.UtcNow;        
            }
            else
            {
                checkCodeResponse = JsonConvert.DeserializeObject<ErrorResponse>(response.ResponseContent);
            }
            return checkCodeResponse;

        }

        public async Task<object> ConfirmTransaction(string barCode, string locationID, Guid partnerId, Guid userId)
        {
            var confirmTransactionResponse = new object();
            var partnerTransactionID = Guid.NewGuid();
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == partnerId).FirstOrDefault();
            var requestDateTimeUTC = DateTime.UtcNow;
            var confirmTransactionRequest = new ConfirmTransactionRequest()
            {
                PartnerID = partnerId.ToString(),
                BarCode = barCode,
                PartnerTransactionID= partnerTransactionID.ToString(),
                LocationID = locationID
            };
            var sequence = AircashSignatureService.ConvertObjectToString(confirmTransactionRequest);
            var signature = AircashSignatureService.GenerateSignature(sequence, partner.PrivateKey, partner.PrivateKeyPass);
            confirmTransactionRequest.Signature = signature;
            var response = await HttpRequestService.SendRequestAircash(confirmTransactionRequest, HttpMethod.Post, $"{AircashConfiguration.M2BaseUrl}" + $"{AircashConfiguration.ConfirmTransactionEndpoint}");
            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                ConfirmTransactionResponse successResponse = JsonConvert.DeserializeObject<ConfirmTransactionResponse>(response.ResponseContent);
                ServiceEnum serviceId;
                if (successResponse.Amount >= 0) { serviceId = ServiceEnum.AircashPayment; }
                else { serviceId = ServiceEnum.AircashPayout; }
                var responseDateTimeUTC = DateTime.UtcNow;
                AircashSimulatorContext.Transactions.Add(new TransactionEntity
                {
                    Amount = successResponse.Amount,
                    ISOCurrencyId = (CurrencyEnum)partner.CurrencyId,
                    PartnerId = partnerId,
                    AircashTransactionId = successResponse.AircashTransactionID,
                    TransactionId = partnerTransactionID,
                    ServiceId = serviceId,
                    UserId = userId,
                    PointOfSaleId = confirmTransactionRequest.LocationID,
                    RequestDateTimeUTC = requestDateTimeUTC,
                    ResponseDateTimeUTC = responseDateTimeUTC
                });
                AircashSimulatorContext.SaveChanges();
                confirmTransactionResponse = successResponse;
            }
            else
            {
                confirmTransactionResponse = JsonConvert.DeserializeObject<ErrorResponse>(response.ResponseContent);
            }
            return confirmTransactionResponse;

        }

        public async Task<object> CheckTransactionStatus(string partnerTransactionID, Guid partnerId)
        {
            var checkTransactionStatusResponse = new object();
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == partnerId).FirstOrDefault();
            var requestDateTimeUTC = DateTime.UtcNow;
            var checkTransactionStatusRequest = new CheckTransactionStatusRequest()
            {
                PartnerID = partnerId.ToString(),
                PartnerTransactionID = partnerTransactionID
            };
            var sequence = AircashSignatureService.ConvertObjectToString(checkTransactionStatusRequest);
            var signature = AircashSignatureService.GenerateSignature(sequence, partner.PrivateKey, partner.PrivateKeyPass);
            checkTransactionStatusRequest.Signature = signature;
            var response = await HttpRequestService.SendRequestAircash(checkTransactionStatusRequest, HttpMethod.Post, $"{AircashConfiguration.M2BaseUrl}" + $"{AircashConfiguration.PaymentCheckTransactionStatusEndpoint}");
            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                checkTransactionStatusResponse = JsonConvert.DeserializeObject<CheckTransactionStatusResponse>(response.ResponseContent);
                var responseDateTimeUTC = DateTime.UtcNow;
            }
            else
            {
                checkTransactionStatusResponse = JsonConvert.DeserializeObject<ErrorResponse>(response.ResponseContent);
            }
            return checkTransactionStatusResponse;

        }

        public async Task<object> CancelTransaction(string partnerTransactionID, string locationID, Guid partnerId, Guid userId)
        {
            var cancelTransactionResponse = new object();
            var transaction = AircashSimulatorContext.Transactions.Where(x => x.TransactionId.ToString() == partnerTransactionID).FirstOrDefault();
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == partnerId).FirstOrDefault();
            var requestDateTimeUTC = DateTime.UtcNow;
            var cancelTransactionRequest = new CancelTransactionRequest()
            {
                PartnerID = partnerId.ToString(),
                LocationID=locationID,
                PartnerTransactionID = partnerTransactionID
            };
            var sequence = AircashSignatureService.ConvertObjectToString(cancelTransactionRequest);
            var signature = AircashSignatureService.GenerateSignature(sequence, partner.PrivateKey, partner.PrivateKeyPass);
            cancelTransactionRequest.Signature = signature;
            var response = await HttpRequestService.SendRequestAircash(cancelTransactionRequest, HttpMethod.Post, $"{AircashConfiguration.M2BaseUrl}" + $"{AircashConfiguration.PaymentCancelTransactionEndpoint}");
            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                cancelTransactionResponse = (response.ResponseContent).ToString();
                var responseDateTimeUTC = DateTime.UtcNow;
                AircashSimulatorContext.Transactions.Add(new TransactionEntity
                {
                    Amount = transaction.Amount,
                    ISOCurrencyId = (CurrencyEnum)partner.CurrencyId,
                    PartnerId = partnerId,
                    AircashTransactionId = transaction.AircashTransactionId,
                    TransactionId = new Guid (partnerTransactionID),
                    ServiceId = ServiceEnum.AircashCancellation,
                    UserId = userId,
                    PointOfSaleId = locationID,
                    RequestDateTimeUTC = requestDateTimeUTC,
                    ResponseDateTimeUTC = responseDateTimeUTC
                });
                AircashSimulatorContext.SaveChanges();
            }
            else
            {
                cancelTransactionResponse = JsonConvert.DeserializeObject<ErrorResponse>(response.ResponseContent);
            }
            return cancelTransactionResponse;

        }
    }
}
