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

    }
}
