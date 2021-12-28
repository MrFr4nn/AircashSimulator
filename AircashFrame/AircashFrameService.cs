using AircashSignature;
using AircashSimulator.Configuration;
using DataAccess;
using Domain.Entities;
using Domain.Entities.Enum;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Services.AircashFrame;
using Services.HttpRequest;
using System;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace AircashFrame
{
    public class AircashFrameService : IAircashFrameService
    {
        private AircashSimulatorContext AircashSimulatorContext;
        private IHttpRequestService HttpRequestService;
        private AircashConfiguration AircashConfiguration;
        private ILogger<AircashFrameService> Logger;

        public AircashFrameService(AircashSimulatorContext aircashSimulatorContext, IHttpRequestService httpRequestService, IOptionsMonitor<AircashConfiguration> aircashConfiguration, ILogger<AircashFrameService> logger)
        {
            AircashSimulatorContext = aircashSimulatorContext;
            HttpRequestService = httpRequestService;
            AircashConfiguration = aircashConfiguration.CurrentValue;
            Logger = logger;
        }
        public async Task<object> Initiate(InitiateRequestDTO initiateRequestDTO)
        {
            var requestDateTime = DateTime.UtcNow;
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == initiateRequestDTO.PartnerId).FirstOrDefault();
            var preparedTransaction = new PreparedAircashFrameTransactionEntity
            {
                PartnerTransactionId = Guid.NewGuid(),
                PartnerId = initiateRequestDTO.PartnerId,
                UserId = initiateRequestDTO.UserId,
                Amount = initiateRequestDTO.Amount,
                ISOCurrencyId = (CurrencyEnum)initiateRequestDTO.Currency,
                PayType = initiateRequestDTO.PayType,
                PayMethod = initiateRequestDTO.PayMethod,
                NotificationUrl = $"{AircashConfiguration.NotificationUrl}",
                SuccessUrl = $"{AircashConfiguration.SuccessUrl}",
                DeclineUrl = $"{AircashConfiguration.DeclineUrl}",
                RequestDateTimeUTC = requestDateTime
            };
            AircashSimulatorContext.Add(preparedTransaction);
            AircashSimulatorContext.SaveChanges();
            var aircashInitiateResponse = new object();
            var aircashInitiateRequest = new AircashInitiateRequest
            {
                PartnerId = preparedTransaction.PartnerId.ToString(),
                PartnerUserId = preparedTransaction.UserId.ToString(),
                PartnerTransactionId = preparedTransaction.PartnerTransactionId.ToString(),
                Amount = preparedTransaction.Amount.ToString(),
                CurrencyId = initiateRequestDTO.Currency,
                PayType = preparedTransaction.PayType,
                PayMethod = preparedTransaction.PayMethod,
                NotificationUrl = preparedTransaction.NotificationUrl,
                SuccessUrl = preparedTransaction.SuccessUrl,
                DeclineUrl = preparedTransaction.DeclineUrl,
                Locale = "en-US"
            };
            var dataToSign = AircashSignatureService.ConvertObjectToString(aircashInitiateRequest);
            Logger.LogInformation(partner.PrivateKey);
            var signature = AircashSignatureService.GenerateSignature(dataToSign, partner.PrivateKey, partner.PrivateKeyPass);
            aircashInitiateRequest.Signature = signature;
            var response = await HttpRequestService.SendRequestAircash(aircashInitiateRequest, HttpMethod.Post, $"{AircashConfiguration.AircashFrameTestUrl}{AircashConfiguration.InitiateEndpoint}");
            var responseDateTime = DateTime.UtcNow;
            preparedTransaction.ResponseDateTimeUTC = responseDateTime;
            AircashSimulatorContext.Update(preparedTransaction);
            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                aircashInitiateResponse = JsonConvert.DeserializeObject<AircashInitiateResponse>(response.ResponseContent);
            }
            else
            {
                aircashInitiateResponse = JsonConvert.DeserializeObject<ErrorResponse>(response.ResponseContent);
            }
            var frontResponse = new Response
            {
                ServiceRequest = aircashInitiateRequest,
                ServiceResponse = aircashInitiateResponse,
                Sequence = dataToSign,
                RequestDateTimeUTC = requestDateTime,
                ResponseDateTimeUTC = responseDateTime
            };
            return frontResponse;
        }

        public async void Notification(string transactionId)
        {
            var preparedAircashFrameTransaction = AircashSimulatorContext.PreparedAircashFrameTransactions.Where(x => x.PartnerTransactionId == new Guid(transactionId)).FirstOrDefault();
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == preparedAircashFrameTransaction.PartnerId).FirstOrDefault();
            var response = await CheckTransactionStatus(partner, transactionId);
            var responseDateTime = DateTime.UtcNow;
            preparedAircashFrameTransaction.ResponseDateTimeUTC = responseDateTime;
            AircashSimulatorContext.Update(preparedAircashFrameTransaction);
            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                var aircashTransactionStatusResponseTemp = JsonConvert.DeserializeObject<AircashTransactionStatusResponse>(response.ResponseContent);
                var dataToVerify = AircashSignatureService.ConvertObjectToString(aircashTransactionStatusResponseTemp);
                if (AircashSignatureService.VerifySignature(dataToVerify, aircashTransactionStatusResponseTemp.Signature, $"{AircashConfiguration.AcFramePublicKey}") && aircashTransactionStatusResponseTemp.Status == 2)
                {
                    AircashSimulatorContext.Add(new TransactionEntity
                    {
                        Amount = preparedAircashFrameTransaction.Amount,
                        ISOCurrencyId = preparedAircashFrameTransaction.ISOCurrencyId,
                        PartnerId = preparedAircashFrameTransaction.PartnerId,
                        AircashTransactionId = aircashTransactionStatusResponseTemp.AircashTransactionId,
                        TransactionId = preparedAircashFrameTransaction.PartnerTransactionId,
                        RequestDateTimeUTC = preparedAircashFrameTransaction.RequestDateTimeUTC,
                        ResponseDateTimeUTC = preparedAircashFrameTransaction.ResponseDateTimeUTC,
                        UserId = preparedAircashFrameTransaction.UserId
                    });
                    AircashSimulatorContext.SaveChanges();
                }
            }
        }

        public async Task<object> TransactionStatus(Guid partnerId, string transactionId)
        {
            var requestDateTime = DateTime.UtcNow;
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == partnerId).FirstOrDefault();
            var preparedAircashFrameTransaction = AircashSimulatorContext.PreparedAircashFrameTransactions.Where(x => x.PartnerTransactionId == new Guid(transactionId)).FirstOrDefault();
            var aircashTransactionStatusResponse = new object();
            var aircashTransactionStatusRequest = new AircashTransactionStatusRequest
            {
                PartnerId = partnerId.ToString(),
                PartnerTransactionId = transactionId,
            };
            var dataToSign = AircashSignatureService.ConvertObjectToString(aircashTransactionStatusRequest);
            Logger.LogInformation(partner.PrivateKey);
            var signature = AircashSignatureService.GenerateSignature(dataToSign, partner.PrivateKey, partner.PrivateKeyPass);
            aircashTransactionStatusRequest.Signature = signature;
            var response = await HttpRequestService.SendRequestAircash(aircashTransactionStatusRequest, HttpMethod.Post, $"{AircashConfiguration.AircashFrameTestUrl}{AircashConfiguration.TransactionStatusEndpoint}");
            var responseDateTime = DateTime.UtcNow;
            aircashTransactionStatusResponse = JsonConvert.DeserializeObject<AircashTransactionStatusResponse>(response.ResponseContent);
            var frontResponse = new Response
            {
                ServiceRequest = aircashTransactionStatusRequest,
                ServiceResponse = aircashTransactionStatusResponse,
                Sequence = dataToSign,
                RequestDateTimeUTC = requestDateTime,
                ResponseDateTimeUTC = responseDateTime
            };
            return frontResponse;
        }

        public async Task<HttpResponse> CheckTransactionStatus(PartnerEntity partner, string transactionId)
        {
            var aircashTransactionStatusRequest = new AircashTransactionStatusRequest
            {
                PartnerId = partner.PartnerId.ToString(),
                PartnerTransactionId = transactionId,
            };
            var dataToSign = AircashSignatureService.ConvertObjectToString(aircashTransactionStatusRequest);
            Logger.LogInformation(partner.PrivateKey);
            var signature = AircashSignatureService.GenerateSignature(dataToSign, partner.PrivateKey, partner.PrivateKeyPass);
            aircashTransactionStatusRequest.Signature = signature;
            var response = await HttpRequestService.SendRequestAircash(aircashTransactionStatusRequest, HttpMethod.Post, $"{AircashConfiguration.AircashFrameTestUrl}{AircashConfiguration.TransactionStatusEndpoint}");
            return response;
        }
    }
}
