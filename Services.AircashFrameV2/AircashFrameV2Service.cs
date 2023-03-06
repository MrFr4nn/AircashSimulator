using System;
using DataAccess;
using System.Linq;
using System.Net.Http;
using Newtonsoft.Json;
using Domain.Entities;
using AircashSignature;
using Services.HttpRequest;
using Domain.Entities.Enum;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using AircashSimulator.Configuration;
using Services.AircashFrameV2;

namespace AircashFrame
{
    public class AircashFrameV2Service : IAircashFrameV2Service
    {
        private AircashSimulatorContext AircashSimulatorContext;
        private IHttpRequestService HttpRequestService;
        private AircashConfiguration AircashConfiguration;
        private ILogger<AircashFrameV2Service> Logger;

        public AircashFrameV2Service(AircashSimulatorContext aircashSimulatorContext, IHttpRequestService httpRequestService, IOptionsMonitor<AircashConfiguration> aircashConfiguration, ILogger<AircashFrameV2Service> logger)
        {
            AircashSimulatorContext = aircashSimulatorContext;
            HttpRequestService = httpRequestService;
            AircashConfiguration = aircashConfiguration.CurrentValue;
            Logger = logger;
        }
      
        public async Task<object> Initiate(InititateRequestV2Dto initiateRequestDTO)
        {
            var requestDateTime = DateTime.UtcNow;
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == initiateRequestDTO.PartnerId).FirstOrDefault();
            var preparedTransaction = new PreparedAircashFrameTransactionEntity
            {
                PartnerTransactionId = Guid.NewGuid(),
                PartnerId = initiateRequestDTO.PartnerId,
                UserId = initiateRequestDTO.UserId,
                Amount = initiateRequestDTO.Amount,
                ISOCurrencyId = (CurrencyEnum)partner.CurrencyId,
                PayType = initiateRequestDTO.PayType,
                PayMethod = initiateRequestDTO.PayMethod,
                NotificationUrl = $"{AircashConfiguration.NotificationUrl}",
                SuccessUrl = $"{AircashConfiguration.SuccessUrl}",
                DeclineUrl = $"{AircashConfiguration.DeclineUrl}",
                RequestDateTimeUTC = requestDateTime,
                TransactionSatus = AcFramePreparedTransactionStatusEnum.Pending
            };
            AircashSimulatorContext.Add(preparedTransaction);
            AircashSimulatorContext.SaveChanges();
            var aircashInitiateResponse = new object();
            var aircashInitiateRequest = new AircashInitiateV2Request
            {
                PartnerId = preparedTransaction.PartnerId.ToString(),
                PartnerUserId = preparedTransaction.UserId.ToString(),
                PartnerTransactionId = preparedTransaction.PartnerTransactionId.ToString(),
                Amount = preparedTransaction.Amount.ToString(),
                CurrencyId = partner.CurrencyId,
                PayType = (int)preparedTransaction.PayType,
                PayMethod = (int)preparedTransaction.PayMethod,
                NotificationUrl = preparedTransaction.NotificationUrl,
                SuccessUrl = initiateRequestDTO.SuccessUrl,
                DeclineUrl = initiateRequestDTO.DeclineUrl,
                OriginUrl = initiateRequestDTO.OriginUrl,
                CancelUrl = initiateRequestDTO.CancelUrl,
                Locale = "en-US"
            };
            var dataToSign = AircashSignatureService.ConvertObjectToString(aircashInitiateRequest);
            Logger.LogInformation(partner.PrivateKey);
            var signature = AircashSignatureService.GenerateSignature(dataToSign, partner.PrivateKey, partner.PrivateKeyPass);
            aircashInitiateRequest.Signature = signature;
            var response = await HttpRequestService.SendRequestAircash(aircashInitiateRequest, HttpMethod.Post, $"https://stage-frame-api.aircash.eu/api/v2/initiate");
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

        public async Task<object> InitiateCashierFrameV2(InititateRequestV2Dto initiateRequestDTO)
        {
            var requestDateTime = DateTime.UtcNow;
            var sPartnerTransactionId = Guid.NewGuid();
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == initiateRequestDTO.PartnerId).FirstOrDefault();
            var preparedTransaction = new PreparedAircashFrameTransactionEntity
            {
                PartnerTransactionId = sPartnerTransactionId,
                PartnerId = initiateRequestDTO.PartnerId,
                UserId = initiateRequestDTO.UserId,
                Amount = initiateRequestDTO.Amount,
                ISOCurrencyId = (CurrencyEnum)partner.CurrencyId,
                PayType = initiateRequestDTO.PayType,
                PayMethod = initiateRequestDTO.PayMethod,
                NotificationUrl = initiateRequestDTO.NotificationUrl,
                SuccessUrl = initiateRequestDTO.SuccessUrl,
                DeclineUrl = initiateRequestDTO.DeclineUrl,
                RequestDateTimeUTC = requestDateTime,
                TransactionSatus = AcFramePreparedTransactionStatusEnum.Pending
            };
            AircashSimulatorContext.Add(preparedTransaction);
            AircashSimulatorContext.SaveChanges();
            var aircashInitiateResponse = new object();
            var aircashInitiateFrameUrlResponse = new AircashInitiateResponse();
            var aircashInitiateRequest = new AircashInitiateV2Request
            {
                PartnerId = preparedTransaction.PartnerId.ToString(),
                PartnerUserId = preparedTransaction.UserId.ToString(),
                PartnerTransactionId = preparedTransaction.PartnerTransactionId.ToString(),
                Amount = preparedTransaction.Amount.ToString(),
                CurrencyId = partner.CurrencyId,
                PayType = (int)preparedTransaction.PayType,
                PayMethod = (int)preparedTransaction.PayMethod,
                NotificationUrl = preparedTransaction.NotificationUrl,
                SuccessUrl = initiateRequestDTO.SuccessUrl,
                DeclineUrl = initiateRequestDTO.DeclineUrl,
                OriginUrl = initiateRequestDTO.OriginUrl,
                CancelUrl = initiateRequestDTO.CancelUrl,
                Locale = "en-US"
            };
            var dataToSign = AircashSignatureService.ConvertObjectToString(aircashInitiateRequest);
            Logger.LogInformation(partner.PrivateKey);
            var signature = AircashSignatureService.GenerateSignature(dataToSign, partner.PrivateKey, partner.PrivateKeyPass);
            aircashInitiateRequest.Signature = signature;
            var response = await HttpRequestService.SendRequestAircash(aircashInitiateRequest, HttpMethod.Post, $"https://stage-frame-api.aircash.eu/api/v2/initiate");
            var responseDateTime = DateTime.UtcNow;
            var responseAcFrameUrl = "";
            preparedTransaction.ResponseDateTimeUTC = responseDateTime;
            AircashSimulatorContext.Update(preparedTransaction);
            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                aircashInitiateResponse = JsonConvert.DeserializeObject<AircashInitiateResponse>(response.ResponseContent);
                aircashInitiateFrameUrlResponse = JsonConvert.DeserializeObject<AircashInitiateResponse>(response.ResponseContent);
                responseAcFrameUrl = aircashInitiateFrameUrlResponse.Url;
            }
            else
            {
                aircashInitiateResponse = JsonConvert.DeserializeObject<ErrorResponse>(response.ResponseContent);
            }
            var frontResponse = new ResponseAircashFrameV2Url
            {
                ServiceRequest = aircashInitiateRequest,
                ServiceResponse = aircashInitiateResponse,
                Sequence = dataToSign,
                RequestDateTimeUTC = requestDateTime,
                ResponseDateTimeUTC = responseDateTime,
                AcFrameUrl = responseAcFrameUrl
            };
            return frontResponse;
        }

        public async Task<int> NotificationCashierFrameV2(string transactionId)
        {
            var preparedAircashFrameTransaction = AircashSimulatorContext.PreparedAircashFrameTransactions.Where(x => x.PartnerTransactionId == new Guid(transactionId)).FirstOrDefault();
            if (preparedAircashFrameTransaction.TransactionSatus == AcFramePreparedTransactionStatusEnum.Confirmed)
            {
                return 0;
            }
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == preparedAircashFrameTransaction.PartnerId).FirstOrDefault();
            var frontResponse = await CheckTransactionStatusCashierFrameV2(partner, transactionId);
            var responseDateTime = DateTime.UtcNow;
            var aircashTransactionStatusResponse = (AircashTransactionStatusResponseV2)frontResponse.ServiceResponse;
            var dataToVerify = AircashSignatureService.ConvertObjectToString(aircashTransactionStatusResponse);
            var serviceId = ServiceEnum.AircashPay;
            if (preparedAircashFrameTransaction.PayType == PayTypeEnum.Payment)
            {
                if (preparedAircashFrameTransaction.PayMethod == PayMethodEnum.Abon) { serviceId = ServiceEnum.AbonUsed; }
                else if (preparedAircashFrameTransaction.PayMethod == PayMethodEnum.AcPay) { serviceId = ServiceEnum.AircashPay; }
            }
            else
            {
                if (preparedAircashFrameTransaction.PayMethod == PayMethodEnum.Payout) { serviceId = ServiceEnum.AircashPayout; }
            }
            if (AircashSignatureService.VerifySignature(dataToVerify, aircashTransactionStatusResponse.Signature, $"{AircashConfiguration.AcFramePublicKey}"))
            {
                if (aircashTransactionStatusResponse.Status == AcFrameTransactionStatusEnum.Success)
                {
                    preparedAircashFrameTransaction.ResponseDateTimeUTC = responseDateTime;
                    preparedAircashFrameTransaction.TransactionSatus = AcFramePreparedTransactionStatusEnum.Confirmed;
                    AircashSimulatorContext.Update(preparedAircashFrameTransaction);
                    AircashSimulatorContext.Add(new TransactionEntity
                    {
                        Amount = preparedAircashFrameTransaction.Amount,
                        ISOCurrencyId = preparedAircashFrameTransaction.ISOCurrencyId,
                        PartnerId = preparedAircashFrameTransaction.PartnerId,
                        AircashTransactionId = aircashTransactionStatusResponse.AircashTransactionId,
                        TransactionId = preparedAircashFrameTransaction.PartnerTransactionId,
                        RequestDateTimeUTC = preparedAircashFrameTransaction.RequestDateTimeUTC,
                        ResponseDateTimeUTC = preparedAircashFrameTransaction.ResponseDateTimeUTC,
                        ServiceId = serviceId,
                        UserId = preparedAircashFrameTransaction.UserId
                    });
                    AircashSimulatorContext.SaveChanges();
                }
                return 1;
            }
            else return 2;
        }

        public async Task<object> TransactionStatusCashierFrameV2(Guid partnerId, string transactionId)
        {
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == partnerId).FirstOrDefault();
            var frontResponse = await CheckTransactionStatusCashierFrameV2(partner, transactionId);
            return frontResponse;
        }

        public async Task<Response> CheckTransactionStatusCashierFrameV2(PartnerEntity partner, string transactionId)
        {
            var requestDateTime = DateTime.UtcNow;
            var aircashTransactionStatusRequest = new AircashTransactionStatusRequestV2
            {
                PartnerId = partner.PartnerId.ToString(),
                PartnerTransactionId = transactionId,
            };
            var dataToSign = AircashSignatureService.ConvertObjectToString(aircashTransactionStatusRequest);
            Logger.LogInformation(partner.PrivateKey);
            var signature = AircashSignatureService.GenerateSignature(dataToSign, partner.PrivateKey, partner.PrivateKeyPass);
            aircashTransactionStatusRequest.Signature = signature;
            var response = await HttpRequestService.SendRequestAircash(aircashTransactionStatusRequest, HttpMethod.Post, $"{HttpRequestService.GetEnvironmentBaseUri(partner.Environment, EndpointEnum.Frame)}{AircashConfiguration.TransactionStatusEndpoint}");
            var responseDateTime = DateTime.UtcNow;
            var aircashTransactionStatusResponse = JsonConvert.DeserializeObject<AircashTransactionStatusResponseV2>(response.ResponseContent);
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
    }
}
