using System;
using DataAccess;
using System.Linq;
using System.Net.Http;
using Domain.Entities;
using Newtonsoft.Json;
using AircashSignature;
using Domain.Entities.Enum;
using Services.HttpRequest;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using AircashSimulator.Configuration;

namespace Services.AircashPay
{
    public class AircashPayService : IAircashPayService
    {
        private AircashSimulatorContext AircashSimulatorContext;
        private IHttpRequestService HttpRequestService;
        private AircashConfiguration AircashConfiguration;
        private ILogger<AircashPayService> Logger;

        public AircashPayService(AircashSimulatorContext aircashSimulatorContext, IHttpRequestService httpRequestService, IOptionsMonitor<AircashConfiguration> aircashConfiguration, ILogger<AircashPayService> logger)
        {
            AircashSimulatorContext = aircashSimulatorContext;
            HttpRequestService = httpRequestService;
            AircashConfiguration = aircashConfiguration.CurrentValue;
            Logger = logger;
        }
        public async Task<object> GeneratePartnerCode(GeneratePartnerCodeDTO generatePartnerCodeDTO)
        {
            var requestDateTime = DateTime.UtcNow;
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == generatePartnerCodeDTO.PartnerId).FirstOrDefault();
            var preparedTransaction = new PreparedAircashPayTransactionEntity
            {
                PartnerId = generatePartnerCodeDTO.PartnerId,
                Amount = generatePartnerCodeDTO.Amount,
                ISOCurrencyId = (CurrencyEnum)partner.CurrencyId,
                PartnerTransactionId = Guid.NewGuid(),
                Description = generatePartnerCodeDTO.Description,
                ValidForPeriod = int.Parse($"{ AircashConfiguration.ValidForPeriod }"),
                LocationId = generatePartnerCodeDTO.LocationId,
                UserId = generatePartnerCodeDTO.UserId,
                Status = AcPayTransactionSatusEnum.Pending,
                RequestDateTimeUTC = DateTime.UtcNow
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
            Logger.LogInformation(partner.PrivateKey);
            var signature = AircashSignatureService.GenerateSignature(dataToSign, partner.PrivateKey, partner.PrivateKeyPass);
            aircashGeneratePartnerCodeRequest.Signature = signature;
            var response = await HttpRequestService.SendRequestAircash(aircashGeneratePartnerCodeRequest, HttpMethod.Post, $"{HttpRequestService.GetEnvironmentBaseUri(partner.Environment, EndpointEnum.M3)}{AircashConfiguration.GeneratePartnerCodeEndpoint}");
            var responseDateTime = DateTime.UtcNow;
            preparedTransaction.ResponseDateTimeUTC = responseDateTime;
            AircashSimulatorContext.Update(preparedTransaction);
            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                aircashGeneratePartnerCodeResponse = JsonConvert.DeserializeObject<AircashGeneratePartnerCodeResponse>(response.ResponseContent);
            }
            else
            {
                aircashGeneratePartnerCodeResponse = JsonConvert.DeserializeObject<ErrorResponse>(response.ResponseContent);
            }
            var frontResponse = new Response
            {
                ServiceRequest = aircashGeneratePartnerCodeRequest,
                ServiceResponse = aircashGeneratePartnerCodeResponse,
                Sequence = dataToSign,
                RequestDateTimeUTC = requestDateTime,
                ResponseDateTimeUTC = responseDateTime
            };
            return frontResponse;
        }

        public async Task<object> ConfirmTransaction(TransactionDTO transactionDTO)
        {
            if (AircashSimulatorContext.PreparedAircashPayTransactions.FirstOrDefault(x => x.PartnerTransactionId == transactionDTO.PartnerTransactionId) != null)
            {
                var preparedTransaction = AircashSimulatorContext.PreparedAircashPayTransactions.FirstOrDefault(x => x.PartnerTransactionId == transactionDTO.PartnerTransactionId);
                preparedTransaction.Status = AcPayTransactionSatusEnum.Confirmed;
                preparedTransaction.ResponseDateTimeUTC = DateTime.UtcNow;
                AircashSimulatorContext.Update(preparedTransaction);
                AircashSimulatorContext.Transactions.Add(new TransactionEntity
                {
                    Amount = preparedTransaction.Amount,
                    ISOCurrencyId = preparedTransaction.ISOCurrencyId,
                    PartnerId = preparedTransaction.PartnerId,
                    AircashTransactionId = transactionDTO.AircashTransactionId,
                    TransactionId = preparedTransaction.PartnerTransactionId,
                    ServiceId = ServiceEnum.AircashPay,
                    UserId = preparedTransaction.UserId,
                    RequestDateTimeUTC = preparedTransaction.RequestDateTimeUTC,
                    ResponseDateTimeUTC = preparedTransaction.ResponseDateTimeUTC,
                    PointOfSaleId = preparedTransaction.LocationId
                });
                await AircashSimulatorContext.SaveChangesAsync();
                return new ConfirmResponse { ResponseCode = 1 };
            }
            else
            {
                return new ConfirmResponse { ResponseCode = 2 };
            }
        }

        public async Task<object> CancelTransaction(CancelTransactionDTO cancelTransactionDTO)
        {
            var requestDateTime = DateTime.UtcNow;
            var aircashCancelTransactionResponse = new object();
            var aircashCancelTransactionRequest = new AircashCancelTransactionRequest
            {
                PartnerID = cancelTransactionDTO.PartnerId.ToString(),
                PartnerTransactionID = cancelTransactionDTO.PartnerTransactionId.ToString()
            };
            var partner = AircashSimulatorContext.Partners.FirstOrDefault(x => x.PartnerId == cancelTransactionDTO.PartnerId);
            var dataToSign = AircashSignatureService.ConvertObjectToString(aircashCancelTransactionRequest);
            var signature = AircashSignatureService.GenerateSignature(dataToSign, partner.PrivateKey, partner.PrivateKeyPass);
            aircashCancelTransactionRequest.Signature = signature;
            var response = await HttpRequestService.SendRequestAircash(aircashCancelTransactionRequest, HttpMethod.Post, $"{HttpRequestService.GetEnvironmentBaseUri(partner.Environment, EndpointEnum.M3)}{AircashConfiguration.CancelTransactionEndpoint}");
            var responseDateTime = DateTime.UtcNow;
            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                aircashCancelTransactionResponse = JsonConvert.DeserializeObject<AircashCancelTransactionResponse>(response.ResponseContent);
                var transaction = AircashSimulatorContext.Transactions.FirstOrDefault(x => x.TransactionId == cancelTransactionDTO.PartnerTransactionId);
                var preparedTransaction = AircashSimulatorContext.PreparedAircashPayTransactions.FirstOrDefault(x => x.PartnerTransactionId == cancelTransactionDTO.PartnerTransactionId);
                preparedTransaction.Status = AcPayTransactionSatusEnum.Cancelled;
                AircashSimulatorContext.Transactions.Add(new TransactionEntity
                {
                    Amount = transaction.Amount,
                    ISOCurrencyId = transaction.ISOCurrencyId,
                    PartnerId = transaction.PartnerId,
                    AircashTransactionId = ((AircashCancelTransactionResponse)aircashCancelTransactionResponse).CancelTransactionID,
                    TransactionId = transaction.TransactionId,
                    ServiceId = ServiceEnum.AircashPayCancellation,
                    UserId = cancelTransactionDTO.UserId,
                    RequestDateTimeUTC = requestDateTime,
                    ResponseDateTimeUTC = responseDateTime,
                    PointOfSaleId = transaction.PointOfSaleId
                });
                AircashSimulatorContext.SaveChanges();
            }
            else
            {
                aircashCancelTransactionResponse = JsonConvert.DeserializeObject<ErrorResponse>(response.ResponseContent);
            }
            var frontResponse = new Response
            {
                ServiceRequest = aircashCancelTransactionRequest,
                ServiceResponse = aircashCancelTransactionResponse,
                Sequence = dataToSign,
                RequestDateTimeUTC = requestDateTime,
                ResponseDateTimeUTC = responseDateTime
            };
            return frontResponse;
        }

        public async Task<object> RefundTransaction(RefundTransactionDTO refundTransactionDTO)
        {
            var requestDateTime = DateTime.UtcNow;
            var aircashRefundTransactionResponse = new object();
            var aircashRefundTransactionRequest = new AircashRefundTransactionRequest
            {
                PartnerID = refundTransactionDTO.PartnerId.ToString(),
                PartnerTransactionID = refundTransactionDTO.PartnerTransactionId.ToString(),
                RefundTransactionID = refundTransactionDTO.RefundTransactionId.ToString(),
                Amount = refundTransactionDTO.Amount
            };
            var partner = AircashSimulatorContext.Partners.FirstOrDefault(x => x.PartnerId == refundTransactionDTO.PartnerId);
            var dataToSign = AircashSignatureService.ConvertObjectToString(aircashRefundTransactionRequest);
            var signature = AircashSignatureService.GenerateSignature(dataToSign, partner.PrivateKey, partner.PrivateKeyPass);
            aircashRefundTransactionRequest.Signature = signature;
            var response = await HttpRequestService.SendRequestAircash(aircashRefundTransactionRequest, HttpMethod.Post, $"{AircashConfiguration.M3BaseUrl}{AircashConfiguration.RefundTransactionEndpoint}");
            var responseDateTime = DateTime.UtcNow;

            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                aircashRefundTransactionResponse = JsonConvert.DeserializeObject<AircashRefundTransactionResponse>(response.ResponseContent);
                var transaction = AircashSimulatorContext.Transactions.FirstOrDefault(x => x.TransactionId == refundTransactionDTO.PartnerTransactionId);

                AircashSimulatorContext.Transactions.Add(new TransactionEntity
                {
                    Amount = refundTransactionDTO.Amount,
                    ISOCurrencyId = transaction.ISOCurrencyId,
                    AircashTransactionId = ((AircashRefundTransactionResponse)aircashRefundTransactionResponse).TransactionId,
                    TransactionId = refundTransactionDTO.RefundTransactionId,
                    ServiceId = ServiceEnum.AircashPayCancellation,
                    RequestDateTimeUTC = requestDateTime,
                    ResponseDateTimeUTC = responseDateTime,
                    PointOfSaleId = transaction.PointOfSaleId
                });
                AircashSimulatorContext.SaveChanges();
            }
            else
            {
                aircashRefundTransactionResponse = JsonConvert.DeserializeObject<ErrorResponse>(response.ResponseContent);
            }
            var frontResponse = new Response
            {
                ServiceRequest = aircashRefundTransactionRequest,
                ServiceResponse = aircashRefundTransactionResponse,
                Sequence = dataToSign,
                RequestDateTimeUTC = requestDateTime,
                ResponseDateTimeUTC = responseDateTime
            };
            return frontResponse;
        }
    }
}
