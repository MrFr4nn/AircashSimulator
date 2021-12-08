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

namespace Services.AircashPay
{
    public class AircashPayService : IAircashPayService
    {
        private AircashSimulatorContext AircashSimulatorContext;
        private IHttpRequestService HttpRequestService;
        private AircashConfiguration AircashConfiguration;

        public AircashPayService(AircashSimulatorContext aircashSimulatorContext, IHttpRequestService httpRequestService, IOptionsMonitor<AircashConfiguration> aircashConfiguration)
        {
            AircashSimulatorContext = aircashSimulatorContext;
            HttpRequestService = httpRequestService;
            AircashConfiguration = aircashConfiguration.CurrentValue;
        }
        public async Task<object> GeneratePartnerCode(GeneratePartnerCodeDTO generatePartnerCodeDTO)
        {

            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == generatePartnerCodeDTO.PartnerId).FirstOrDefault();
            var preparedTransaction = new PreparedAircashTransactionEntity
            {
                PartnerId = generatePartnerCodeDTO.PartnerId,
                Amount = generatePartnerCodeDTO.Amount,
                ISOCurrencyId = (CurrencyEnum)partner.CurrencyId,
                PartnerTransactionId = Guid.NewGuid(),
                Description = generatePartnerCodeDTO.Description,
                ValidForPeriod = int.Parse($"{ AircashConfiguration.ValidForPeriod }"),
                LocationId = generatePartnerCodeDTO.LocationId,
                UserId = generatePartnerCodeDTO.UserId
            };
            AircashSimulatorContext.Add(preparedTransaction);
            AircashSimulatorContext.SaveChanges();
            var aircashGeneratePartnerCodeResponse = new object();
            var aircashGeneratePartnerCodeRequest = new AircashGeneratePartnerCodeRequest 
            {
                PartnerID = preparedTransaction.PartnerId,
                Amount = preparedTransaction.Amount,
                CurrencyID = preparedTransaction.ISOCurrencyId,
                PartnerTransactionID = preparedTransaction.PartnerTransactionId,
                Description = preparedTransaction.Description,
                LocationID = preparedTransaction.LocationId
            };
            var dataToSign = AircashSignatureService.ConvertObjectToString(aircashGeneratePartnerCodeRequest);
            var signature = AircashSignatureService.GenerateSignature(dataToSign, partner.PrivateKey, partner.PrivateKeyPass);
            aircashGeneratePartnerCodeRequest.Signature = signature;
            var response = await HttpRequestService.SendRequestAircash(aircashGeneratePartnerCodeRequest, HttpMethod.Post, $"{AircashConfiguration.M3BaseUrl}{AircashConfiguration.GeneratePartnerCodeEndpoint}");
            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                aircashGeneratePartnerCodeResponse = JsonConvert.DeserializeObject<AircashGeneratePartnerCodeResponse>(response.ResponseContent);
            }
            else
            {
                aircashGeneratePartnerCodeResponse = JsonConvert.DeserializeObject<ErrorResponse>(response.ResponseContent);
            }
            return aircashGeneratePartnerCodeResponse;
        }

        public async Task<object> ConfirmTransaction(TransactionDTO transactionDTO)
        {
            if (AircashSimulatorContext.Transactions.FirstOrDefault(x => x.TransactionId == transactionDTO.PartnerTransactionId) == null)
            {
                var preparedTransaction = AircashSimulatorContext.PreparedAircashTransactions.FirstOrDefault(x => x.PartnerTransactionId == transactionDTO.PartnerTransactionId);
                AircashSimulatorContext.Transactions.Add(new TransactionEntity
                {
                    Amount = transactionDTO.Amount,
                    ISOCurrencyId = (CurrencyEnum)transactionDTO.ISOCurrencyId,
                    PartnerId = transactionDTO.PartnerId,
                    AircashTransactionId = transactionDTO.AircashTransactionId,
                    TransactionId = transactionDTO.PartnerTransactionId,
                    ServiceId = ServiceEnum.AircashPayment,
                    UserId = preparedTransaction.UserId,
                    RequestDateTimeUTC = DateTime.UtcNow,
                    ResponseDateTimeUTC = DateTime.UtcNow,
                    PointOfSaleId = preparedTransaction.LocationId
                });
                AircashSimulatorContext.SaveChanges();
                return new HttpResponse
                {
                    ResponseCode = System.Net.HttpStatusCode.OK,
                    ResponseContent = "Transaction confirmed successfully"
                };
            }
            else
            {
                return new HttpResponse
                {
                    ResponseCode = System.Net.HttpStatusCode.BadRequest,
                    ResponseContent = "Transaction already confirmed"
                };
            }
        }

        public async Task<object> CancelTransaction(CancelTransactionDTO cancelTransactionDTO)
        {
            var aircashCancelTransactionRequest = new AircashCancelTransactionRequest
            {
                PartnerID = cancelTransactionDTO.PartnerId.ToString(),
                PartnerTransactionID = cancelTransactionDTO.PartnerTransactionId.ToString()
            };
            var partner = AircashSimulatorContext.Partners.FirstOrDefault(x => x.PartnerId == cancelTransactionDTO.PartnerId);
            var dataToSign = AircashSignatureService.ConvertObjectToString(aircashCancelTransactionRequest);
            var signature = AircashSignatureService.GenerateSignature(dataToSign, partner.PrivateKey, partner.PrivateKeyPass);
            aircashCancelTransactionRequest.Signature = signature;
            var requestDateTimeUTC = DateTime.UtcNow;
            var response = await HttpRequestService.SendRequestAircash(aircashCancelTransactionRequest, HttpMethod.Post, $"{AircashConfiguration.M3BaseUrl}{AircashConfiguration.CancelTransactionEndpoint}");
            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                var aircashCancelTransactionResponse = JsonConvert.DeserializeObject<AircashCancelTransactionResponse>(response.ResponseContent);
                var transaction = AircashSimulatorContext.Transactions.FirstOrDefault(x => x.TransactionId == cancelTransactionDTO.PartnerTransactionId);
                AircashSimulatorContext.Transactions.Add(new TransactionEntity
                {
                    Amount = transaction.Amount,
                    ISOCurrencyId = (CurrencyEnum)transaction.ISOCurrencyId,
                    PartnerId = transaction.PartnerId,
                    AircashTransactionId = aircashCancelTransactionResponse.CancelTransactionID,
                    TransactionId = transaction.TransactionId,
                    ServiceId = ServiceEnum.AircashCancellation,
                    UserId = cancelTransactionDTO.UserId,
                    RequestDateTimeUTC = requestDateTimeUTC,
                    ResponseDateTimeUTC = DateTime.UtcNow,
                    PointOfSaleId = transaction.PointOfSaleId
                });
                AircashSimulatorContext.SaveChanges();
                return new HttpResponse
                {
                    ResponseCode = System.Net.HttpStatusCode.OK,
                    ResponseContent = "Transaction cancelled successfully"
                };
            }
            else
            {
                return JsonConvert.DeserializeObject<ErrorResponse>(response.ResponseContent);
            }
        }
    }
}
