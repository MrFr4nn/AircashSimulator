﻿using System;
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
using Service.Settings;
using System.Collections.Generic;

namespace AircashFrame
{
    public class AircashFrameV2Service : IAircashFrameV2Service
    {
        private ISettingsService SettingsService;
        private AircashSimulatorContext AircashSimulatorContext;
        private IHttpRequestService HttpRequestService;
        private AircashConfiguration AircashConfiguration;
        private ILogger<AircashFrameV2Service> Logger;

        private readonly string TransactionStatusEndpoint = "status";
        private readonly string InitiateEndpoint = "initiate";

        public AircashFrameV2Service(AircashSimulatorContext aircashSimulatorContext, IHttpRequestService httpRequestService, ISettingsService settingsService, IOptionsMonitor<AircashConfiguration> aircashConfiguration, ILogger<AircashFrameV2Service> logger)
        {
            AircashSimulatorContext = aircashSimulatorContext;
            HttpRequestService = httpRequestService;
            AircashConfiguration = aircashConfiguration.CurrentValue;
            Logger = logger;
            SettingsService = settingsService;
        }
      
        public async Task<object> Initiate(InititateRequestV2Dto initiateRequestDTO, Guid partnerTransactionId, CurrencyEnum currency, EnvironmentEnum environment)
        {
            var requestDateTime = DateTime.UtcNow;
            var preparedTransaction = new PreparedAircashFrameTransactionEntity
            {
                PartnerTransactionId = partnerTransactionId,
                PartnerId = initiateRequestDTO.PartnerId,
                UserId = initiateRequestDTO.UserId,
                Amount = initiateRequestDTO.Amount,
                ISOCurrencyId = currency,
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
            var aircashInitiateSignature = new AircashInitiateV2Request
            {
                PartnerId = preparedTransaction.PartnerId.ToString(),
                PartnerUserId = preparedTransaction.UserId.ToString(),
                PartnerTransactionId = preparedTransaction.PartnerTransactionId.ToString(),
                Amount = preparedTransaction.Amount,
                CurrencyId = (int)currency,
                PayType = (int)preparedTransaction.PayType,
                PayMethod = (int)preparedTransaction.PayMethod,
                NotificationUrl = preparedTransaction.NotificationUrl,
                SuccessUrl = initiateRequestDTO.SuccessUrl,
                DeclineUrl = initiateRequestDTO.DeclineUrl,
                OriginUrl = initiateRequestDTO.OriginUrl,
                CancelUrl = initiateRequestDTO.CancelUrl,
                Locale = initiateRequestDTO.Locale
            };
            var dataToSign = AircashSignatureService.ConvertObjectToString(aircashInitiateSignature);
            //Logger.LogInformation(partner.PrivateKey);
            var signature = AircashSignatureService.GenerateSignature(dataToSign, SettingsService.AircashSimulatorPrivateKeyPath, SettingsService.AircashSimulatorPrivateKeyPass);

            var aircashInitiateRequest = new TransactionInitiateExtendedV2Request
            {
                PartnerId = preparedTransaction.PartnerId.ToString(),
                PartnerUserId = preparedTransaction.UserId.ToString(),
                PartnerTransactionId = preparedTransaction.PartnerTransactionId.ToString(),
                Amount = preparedTransaction.Amount,
                CurrencyId = (int)currency,
                PayType = (int)preparedTransaction.PayType,
                PayMethod = (int)preparedTransaction.PayMethod,
                NotificationUrl = preparedTransaction.NotificationUrl,
                SuccessUrl = initiateRequestDTO.SuccessUrl,
                DeclineUrl = initiateRequestDTO.DeclineUrl,
                OriginUrl = initiateRequestDTO.OriginUrl,
                CancelUrl = initiateRequestDTO.CancelUrl,
                Locale = initiateRequestDTO.Locale,
                CustomParameters = initiateRequestDTO.MatchParameters
            };
            aircashInitiateSignature.Signature = signature;
            aircashInitiateRequest.Signature = signature;
            var response = await HttpRequestService.SendRequestAircash(initiateRequestDTO.MatchParameters == null || initiateRequestDTO.MatchParameters.Count == 0 ? aircashInitiateSignature : aircashInitiateRequest, HttpMethod.Post, $"{HttpRequestService.GetEnvironmentBaseUri(environment, EndpointEnum.FrameV2)}{InitiateEndpoint}");
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
                ServiceRequest = initiateRequestDTO.MatchParameters == null || initiateRequestDTO.MatchParameters.Count == 0 ? aircashInitiateSignature : aircashInitiateRequest,
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
            var aircashInitiateSignature = new AircashInitiateV2Request
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
            var dataToSign = AircashSignatureService.ConvertObjectToString(aircashInitiateSignature);
            var signature = AircashSignatureService.GenerateSignature(dataToSign, SettingsService.AircashSimulatorPrivateKeyPath, SettingsService.AircashSimulatorPrivateKeyPass);
            var aircashInitiateRequest = new TransactionInitiateExtendedV2Request
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
                Locale = "en-HR",
                CustomParameters = initiateRequestDTO.MatchParameters
            };
            aircashInitiateSignature.Signature = signature;
            aircashInitiateRequest.Signature = signature;
            var response = await HttpRequestService.SendRequestAircash(initiateRequestDTO.MatchParameters == null || initiateRequestDTO.MatchParameters.Count == 0 ? aircashInitiateSignature : aircashInitiateRequest, HttpMethod.Post, $"{AircashConfiguration.AircashFrameBaseUrl}{InitiateEndpoint}");
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

        public async Task<AircashTransactionStatusResponseV2> CheckTransactionStatusCashierFrameV2(PartnerEntity partner, string transactionId)
        {
            var aircashTransactionStatusRequest = new AircashTransactionStatusRequestV2
            {
                PartnerId = partner.PartnerId.ToString(),
                PartnerTransactionId = transactionId,
            };
            var dataToSign = AircashSignatureService.ConvertObjectToString(aircashTransactionStatusRequest);
            Logger.LogInformation(partner.PrivateKey);
            var signature = AircashSignatureService.GenerateSignature(dataToSign, SettingsService.AircashSimulatorPrivateKeyPath, SettingsService.AircashSimulatorPrivateKeyPass);
            aircashTransactionStatusRequest.Signature = signature;
            var aircashTransactionStatusResponse = new AircashTransactionStatusResponseV2();
            var response = await HttpRequestService.SendRequestAircash(aircashTransactionStatusRequest, HttpMethod.Post, $"{HttpRequestService.GetEnvironmentBaseUri(partner.Environment, EndpointEnum.Frame)}{TransactionStatusEndpoint}");
            aircashTransactionStatusResponse = JsonConvert.DeserializeObject<AircashTransactionStatusResponseV2>(response.ResponseContent);
            return aircashTransactionStatusResponse;
        }

        public async Task<object> CheckTransactionStatusFrame(Guid partnerId, string transactionId, EnvironmentEnum environment)
        {
            var returnResponse = new Response();
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == partnerId).FirstOrDefault();
            returnResponse.RequestDateTimeUTC = DateTime.UtcNow;
            var aircashTransactionStatusRequest = new AircashTransactionStatusRequestV2
            {
                PartnerId = partnerId.ToString(),
                PartnerTransactionId = transactionId,
            };
            returnResponse.ServiceRequest = aircashTransactionStatusRequest;
            var dataToSign = AircashSignatureService.ConvertObjectToString(aircashTransactionStatusRequest);
            returnResponse.Sequence = dataToSign;
            //Logger.LogInformation(partner.PrivateKey);
            var signature = AircashSignatureService.GenerateSignature(dataToSign, SettingsService.AircashSimulatorPrivateKeyPath, SettingsService.AircashSimulatorPrivateKeyPass);
            aircashTransactionStatusRequest.Signature = signature;
            var aircashTransactionStatusResponse = new object();
            var response = await HttpRequestService.SendRequestAircash(aircashTransactionStatusRequest, HttpMethod.Post, $"{HttpRequestService.GetEnvironmentBaseUri(environment, EndpointEnum.Frame)}{TransactionStatusEndpoint}");
            returnResponse.ResponseDateTimeUTC = DateTime.Now;
            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                aircashTransactionStatusResponse = JsonConvert.DeserializeObject<AircashTransactionStatusResponseV2>(response.ResponseContent);
            }
            else
            {
                aircashTransactionStatusResponse = JsonConvert.DeserializeObject<ErrorResponse>(response.ResponseContent);
            }
            returnResponse.ServiceResponse = aircashTransactionStatusResponse;
            return returnResponse;
        }
    }
}
