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

        private readonly string TransactionStatusEndpoint = "status";
        private readonly string InitiateEndpoint = "initiate";

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
                Amount = preparedTransaction.Amount,
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
            var response = await HttpRequestService.SendRequestAircash(aircashInitiateRequest, HttpMethod.Post, $"{AircashConfiguration.AircashFrameBaseUrl}{InitiateEndpoint}");
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

        public async Task<ResponseAircashFrameV2Url> InitiateCashierFrameV2(InititateRequestV2Dto initiateRequestDTO)
        {
            var requestDateTime = DateTime.UtcNow;
            var partnerTransactionId = Guid.NewGuid();
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == initiateRequestDTO.PartnerId).FirstOrDefault();
            var preparedTransaction = new PreparedAircashFrameTransactionEntity
            {
                PartnerTransactionId = partnerTransactionId,
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
            var aircashInitiateRequest = new AircashInitiateV2Request
            {
                PartnerId = preparedTransaction.PartnerId.ToString(),
                PartnerUserId = preparedTransaction.UserId.ToString(),
                PartnerTransactionId = preparedTransaction.PartnerTransactionId.ToString(),
                Amount = preparedTransaction.Amount,
                CurrencyId = partner.CurrencyId,
                PayType = (int)preparedTransaction.PayType,
                PayMethod = (int)preparedTransaction.PayMethod,
                NotificationUrl = preparedTransaction.NotificationUrl,
                SuccessUrl = initiateRequestDTO.SuccessUrl,
                DeclineUrl = initiateRequestDTO.DeclineUrl,
                OriginUrl = initiateRequestDTO.OriginUrl,
                CancelUrl = initiateRequestDTO.CancelUrl,
                Locale = "en-HR"
            };
            var dataToSign = AircashSignatureService.ConvertObjectToString(aircashInitiateRequest);
            var signature = AircashSignatureService.GenerateSignature(dataToSign, partner.PrivateKey, partner.PrivateKeyPass);
            aircashInitiateRequest.Signature = signature;
            var response = await HttpRequestService.SendRequestAircash(aircashInitiateRequest, HttpMethod.Post, $"{AircashConfiguration.AircashFrameBaseUrl}{InitiateEndpoint}");
            var responseDateTime = DateTime.UtcNow;
            preparedTransaction.ResponseDateTimeUTC = responseDateTime;
            AircashSimulatorContext.Update(preparedTransaction);
            var aircashInitiateResponse = new object();
            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                aircashInitiateResponse = JsonConvert.DeserializeObject<AircashInitiateResponse>(response.ResponseContent);
            }
            else
            {
                aircashInitiateResponse = JsonConvert.DeserializeObject<ErrorResponse>(response.ResponseContent);
            }
            var responseToController = new ResponseAircashFrameV2Url
            {
                ServiceResponse = aircashInitiateResponse
            };
            return responseToController;
        }

        public async Task NotificationCashierFrameV2(Guid transactionId)
        {
            var preparedAircashFrameTransaction = AircashSimulatorContext.PreparedAircashFrameTransactions.Where(x => x.PartnerTransactionId == transactionId).FirstOrDefault();
            if (preparedAircashFrameTransaction.TransactionSatus == AcFramePreparedTransactionStatusEnum.Confirmed)
            {
                return;
            }
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == preparedAircashFrameTransaction.PartnerId).FirstOrDefault();
            var checkTransactionStatusResponse = await CheckTransactionStatusCashierFrameV2(partner, transactionId.ToString());
            var responseDateTime = DateTime.UtcNow;
            if (checkTransactionStatusResponse.Status == AcFrameTransactionStatusEnum.Success)
            {
                var serviceId = ServiceEnum.AircashPay;
                if (preparedAircashFrameTransaction.PayType == PayTypeEnum.Payment)
                {
                    if (preparedAircashFrameTransaction.PayMethod == PayMethodEnum.AcPay) { serviceId = ServiceEnum.AircashPay; }
                }
                preparedAircashFrameTransaction.ResponseDateTimeUTC = responseDateTime;
                preparedAircashFrameTransaction.TransactionSatus = AcFramePreparedTransactionStatusEnum.Confirmed;
                AircashSimulatorContext.Update(preparedAircashFrameTransaction);
                AircashSimulatorContext.Add(new TransactionEntity
                {
                    Amount = preparedAircashFrameTransaction.Amount,
                    ISOCurrencyId = preparedAircashFrameTransaction.ISOCurrencyId,
                    PartnerId = preparedAircashFrameTransaction.PartnerId,
                    AircashTransactionId = checkTransactionStatusResponse.AircashTransactionId,
                    TransactionId = preparedAircashFrameTransaction.PartnerTransactionId,
                    RequestDateTimeUTC = preparedAircashFrameTransaction.RequestDateTimeUTC,
                    ResponseDateTimeUTC = preparedAircashFrameTransaction.ResponseDateTimeUTC,
                    ServiceId = serviceId,
                    UserId = preparedAircashFrameTransaction.UserId
                });
                AircashSimulatorContext.SaveChanges();                
            }
        }

        public async Task<object> TransactionStatusCashierFrameV2(Guid partnerId, string transactionId)
        {
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == partnerId).FirstOrDefault();
            var frontResponse = await CheckTransactionStatusCashierFrameV2(partner, transactionId);
            return frontResponse;
        }

        public async Task<AircashTransactionStatusResponseV2> CheckTransactionStatusCashierFrameV2(PartnerEntity partner, string transactionId)
        {
            var aircashTransactionStatusRequest = new AircashTransactionStatusRequestV2
            {
                PartnerId = partner.PartnerId.ToString(),
                PartnerTransactionId = transactionId,
            };
            var dataToSign = AircashSignatureService.ConvertObjectToString(aircashTransactionStatusRequest);
            Logger.LogInformation(partner.PrivateKey);
            var signature = AircashSignatureService.GenerateSignature(dataToSign, partner.PrivateKey, partner.PrivateKeyPass);
            aircashTransactionStatusRequest.Signature = signature;
            var aircashTransactionStatusResponse = new AircashTransactionStatusResponseV2();
            var response = await HttpRequestService.SendRequestAircash(aircashTransactionStatusRequest, HttpMethod.Post, $"{HttpRequestService.GetEnvironmentBaseUri(partner.Environment, EndpointEnum.Frame)}{TransactionStatusEndpoint}");
            aircashTransactionStatusResponse = JsonConvert.DeserializeObject<AircashTransactionStatusResponseV2>(response.ResponseContent);
            return aircashTransactionStatusResponse;
        }
    }
}
