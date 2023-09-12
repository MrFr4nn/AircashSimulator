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
using Service.Settings;
using Services.Signature;
using System.Collections.Generic;
using AircashSimulator;

namespace AircashFrame
{
    public class AircashFrameV2Service : IAircashFrameV2Service
    {
        private ISettingsService SettingsService;
        private ISignatureService SignatureService;
        private AircashSimulatorContext AircashSimulatorContext;
        private IHttpRequestService HttpRequestService;
        private AircashConfiguration AircashConfiguration;
        private ILogger<AircashFrameV2Service> Logger;

        private readonly string TransactionStatusEndpoint = "status";
        private readonly string InitiateEndpoint = "initiate";
        private readonly string ConfirmPayoutEndpoint = "confirmPayout";
        private readonly string CancelPayoutEndpoint = "cancelPayout";
        private EnvironmentEnum cashierEnvironment = EnvironmentEnum.Staging;
        private readonly string RefundTransactionEndpoint = "RefundTransaction";

        public AircashFrameV2Service(AircashSimulatorContext aircashSimulatorContext, IHttpRequestService httpRequestService, ISettingsService settingsService, IOptionsMonitor<AircashConfiguration> aircashConfiguration, ILogger<AircashFrameV2Service> logger, ISignatureService signatureService)
        {
            AircashSimulatorContext = aircashSimulatorContext;
            HttpRequestService = httpRequestService;
            AircashConfiguration = aircashConfiguration.CurrentValue;
            Logger = logger;
            SettingsService = settingsService;
            SignatureService = signatureService;
        }

        public async Task<object> Initiate(InititateRequestV2Dto initiateRequestDTO, string partnerTransactionId, CurrencyEnum currency, EnvironmentEnum environment)
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
            var signature = SignatureService.GenerateSignature(initiateRequestDTO.PartnerId, dataToSign);

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

        public async Task<ResponseAircashFrameV2Url> InitiateCashierFrameV2(InititateRequestV2Dto initiateRequestDTO, EnvironmentEnum environment)
        {
            cashierEnvironment = environment;
            var requestDateTime = DateTime.UtcNow;
            var partnerTransactionId = Guid.NewGuid().ToString();
            var preparedTransaction = new PreparedAircashFrameTransactionEntity
            {
                PartnerTransactionId = partnerTransactionId,
                PartnerId = initiateRequestDTO.PartnerId,
                UserId = initiateRequestDTO.UserId,
                Amount = initiateRequestDTO.Amount,
                ISOCurrencyId = CurrencyEnum.EUR,
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
                CurrencyId = (int)CurrencyEnum.EUR,
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
                CurrencyId = (int)CurrencyEnum.EUR,
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
            var response = await HttpRequestService.SendRequestAircash(aircashInitiateRequest, HttpMethod.Post, $"{HttpRequestService.GetEnvironmentBaseUri(environment, EndpointEnum.FrameV2)}{InitiateEndpoint}");
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

        public async Task NotificationCashierFrameV2(string transactionId)
        {
            var preparedAircashFrameTransaction = AircashSimulatorContext.PreparedAircashFrameTransactions.Where(x => x.PartnerTransactionId == transactionId).FirstOrDefault();
            if (preparedAircashFrameTransaction.TransactionSatus == AcFramePreparedTransactionStatusEnum.Confirmed)
            {
                return;
            }
            var checkTransactionStatusResponse = await CheckTransactionStatusCashierFrameV2(preparedAircashFrameTransaction.PartnerId, transactionId.ToString());
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
            if (checkTransactionStatusResponse.Status == AcFrameTransactionStatusEnum.PayoutConfirmationPending)
            {
                await ConfirmPayout(preparedAircashFrameTransaction.PartnerId, preparedAircashFrameTransaction.PartnerTransactionId.ToString(), preparedAircashFrameTransaction.Amount, preparedAircashFrameTransaction.ISOCurrencyId, EnvironmentEnum.Staging);
            }
        }

        public async Task<AircashTransactionStatusResponseV2> CheckTransactionStatusCashierFrameV2(Guid partnerId, string transactionId)
        {
            var aircashTransactionStatusRequest = new AircashTransactionStatusRequestV2
            {
                PartnerId = partnerId.ToString(),
                PartnerTransactionId = transactionId,
            };
            var dataToSign = AircashSignatureService.ConvertObjectToString(aircashTransactionStatusRequest);
            //Logger.LogInformation(partner.PrivateKey);
            var signature = AircashSignatureService.GenerateSignature(dataToSign, SettingsService.AircashSimulatorPrivateKeyPath, SettingsService.AircashSimulatorPrivateKeyPass);
            aircashTransactionStatusRequest.Signature = signature;
            var aircashTransactionStatusResponse = new AircashTransactionStatusResponseV2();
            var response = await HttpRequestService.SendRequestAircash(aircashTransactionStatusRequest, HttpMethod.Post, $"{HttpRequestService.GetEnvironmentBaseUri(cashierEnvironment, EndpointEnum.Frame)}{TransactionStatusEndpoint}");
            aircashTransactionStatusResponse = JsonConvert.DeserializeObject<AircashTransactionStatusResponseV2>(response.ResponseContent);
            return aircashTransactionStatusResponse;
        }

        public async Task<object> CheckTransactionStatusFrame(Guid partnerId, string transactionId, EnvironmentEnum environment)
        {
            var returnResponse = new Response();
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == partnerId).FirstOrDefault();
            returnResponse.RequestDateTimeUTC = DateTime.UtcNow;
            var aircashTransactionStatusRequest = GetCheckTransactionStatusFrameRequest(partnerId, transactionId);
            returnResponse.ServiceRequest = aircashTransactionStatusRequest;
            var dataToSign = AircashSignatureService.ConvertObjectToString(aircashTransactionStatusRequest);
            returnResponse.Sequence = dataToSign;
            //Logger.LogInformation(partner.PrivateKey);
            var signature = SignatureService.GenerateSignature(partnerId, dataToSign);
            aircashTransactionStatusRequest.Signature = signature;
            var aircashTransactionStatusResponse = new object();
            var response = await HttpRequestService.SendRequestAircash(aircashTransactionStatusRequest, HttpMethod.Post, GetCheckTransactionStatusEndpoint(environment));
            returnResponse.ResponseDateTimeUTC = DateTime.Now;
            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                aircashTransactionStatusResponse = JsonConvert.DeserializeObject<AircashTransactionStatusResponseV2NoAmount>(response.ResponseContent);
                var convertedResponse = JsonConvert.DeserializeObject<AircashTransactionStatusResponseV2>(response.ResponseContent);
                if (convertedResponse.Status == AcFrameTransactionStatusEnum.Success)
                {
                    aircashTransactionStatusResponse = convertedResponse;
                }
            }
            else
            {
                aircashTransactionStatusResponse = JsonConvert.DeserializeObject<ErrorResponse>(response.ResponseContent);
            }
            returnResponse.ServiceResponse = aircashTransactionStatusResponse;
            return returnResponse;
        }
        public async Task<object> CheckTransactionStatusV2Frame(Guid partnerId, string transactionId, EnvironmentEnum environment)
        {
            var returnResponse = new Response();
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == partnerId).FirstOrDefault();
            returnResponse.RequestDateTimeUTC = DateTime.UtcNow;
            var aircashTransactionStatusRequest = GetCheckTransactionStatusFrameRequest(partnerId, transactionId);
            returnResponse.ServiceRequest = aircashTransactionStatusRequest;
            var dataToSign = AircashSignatureService.ConvertObjectToString(aircashTransactionStatusRequest);
            returnResponse.Sequence = dataToSign;
            //Logger.LogInformation(partner.PrivateKey);
            var signature = SignatureService.GenerateSignature(partnerId, dataToSign);
            aircashTransactionStatusRequest.Signature = signature;
            var aircashTransactionStatusResponse = new object();
            var response = await HttpRequestService.SendRequestAircash(aircashTransactionStatusRequest, HttpMethod.Post, GetCheckTransactionStatusV2Endpoint(environment));
            returnResponse.ResponseDateTimeUTC = DateTime.Now;
            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                aircashTransactionStatusResponse = JsonConvert.DeserializeObject<AircashTransactionStatusV2ResponseV2NoAmount>(response.ResponseContent);
                var convertedResponse = JsonConvert.DeserializeObject<AircashTransactionStatusV2ResponseV2>(response.ResponseContent);
                if (convertedResponse.Status == AcFrameTransactionStatusEnum.Success)
                {
                    aircashTransactionStatusResponse = convertedResponse;
                }
                var responseSequence = AircashSignatureService.ConvertObjectToString(convertedResponse);
                if (!AircashSignatureService.VerifySignature(responseSequence, convertedResponse.Signature, AircashConfiguration.AcFramePublicKey))
                    throw new SimulatorException(SimulatorExceptionErrorEnum.InvalidResponseSignature, "Invalid Response Signature");
                aircashTransactionStatusResponse = new { ResponseObject = aircashTransactionStatusResponse, ResponseSequence = responseSequence };
            }
            else
            {
                aircashTransactionStatusResponse = JsonConvert.DeserializeObject<ErrorResponse>(response.ResponseContent);
            }
            returnResponse.ServiceResponse = aircashTransactionStatusResponse;
            return returnResponse;
        }
        public async Task<object> CheckTransactionStatusV3Frame(Guid partnerId, string transactionId, EnvironmentEnum environment)
        {
            var returnResponse = new Response();
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == partnerId).FirstOrDefault();
            returnResponse.RequestDateTimeUTC = DateTime.UtcNow;
            var aircashTransactionStatusRequest = GetCheckTransactionStatusFrameRequest(partnerId, transactionId);
            returnResponse.ServiceRequest = aircashTransactionStatusRequest;
            var dataToSign = AircashSignatureService.ConvertObjectToString(aircashTransactionStatusRequest);
            returnResponse.Sequence = dataToSign;
            //Logger.LogInformation(partner.PrivateKey);
            var signature = SignatureService.GenerateSignature(partnerId, dataToSign);
            aircashTransactionStatusRequest.Signature = signature;
            var aircashTransactionStatusResponse = new object();
            var response = await HttpRequestService.SendRequestAircash(aircashTransactionStatusRequest, HttpMethod.Post, GetCheckTransactionStatusV3Endpoint(environment));
            returnResponse.ResponseDateTimeUTC = DateTime.Now;
            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                aircashTransactionStatusResponse = JsonConvert.DeserializeObject<AircashTransactionStatusV3ResponseFrameV2NoAmount>(response.ResponseContent);
                var convertedResponse = JsonConvert.DeserializeObject<AircashTransactionStatusV3ResponseFrameV2>(response.ResponseContent);
                var convertedResponseSequence =JsonConvert.DeserializeObject<AircashTransactionStatusV3ResponseSequence>(response.ResponseContent);
                if (convertedResponse.Status == AcFrameTransactionStatusEnum.Success)
                {
                    aircashTransactionStatusResponse = convertedResponse;
                }
                var responseSequence = AircashSignatureService.ConvertObjectToString(convertedResponseSequence);
                if (!AircashSignatureService.VerifySignature(responseSequence, convertedResponse.Signature, AircashConfiguration.AcFramePublicKey))
                    throw new SimulatorException(SimulatorExceptionErrorEnum.InvalidResponseSignature, "Invalid Response Signature");
                aircashTransactionStatusResponse = new { ResponseObject = aircashTransactionStatusResponse, ResponseSequence = responseSequence };
            }
            else
            {
                aircashTransactionStatusResponse = JsonConvert.DeserializeObject<ErrorResponse>(response.ResponseContent);
            }
            returnResponse.ServiceResponse = aircashTransactionStatusResponse;
            return returnResponse;
        }
        public AircashTransactionStatusRequestV2 GetCheckTransactionStatusFrameRequest(Guid partnerId, string transactionId)
        {
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == partnerId).FirstOrDefault();
            var aircashTransactionStatusRequest = new AircashTransactionStatusRequestV2
            {
                PartnerId = partnerId.ToString(),
                PartnerTransactionId = transactionId,
            };
            var dataToSign = AircashSignatureService.ConvertObjectToString(aircashTransactionStatusRequest);
            var signature = SignatureService.GenerateSignature(partnerId, dataToSign);
            aircashTransactionStatusRequest.Signature = signature;
            return aircashTransactionStatusRequest;
        }
        public string GetCheckTransactionStatusEndpoint(EnvironmentEnum environment)
        {
            return $"{HttpRequestService.GetEnvironmentBaseUri(environment, EndpointEnum.Frame)}{TransactionStatusEndpoint}";

        }
        public string GetCheckTransactionStatusV2Endpoint(EnvironmentEnum environment)
        {
            return $"{HttpRequestService.GetEnvironmentBaseUri(environment, EndpointEnum.FrameV2)}{TransactionStatusEndpoint}";

        }
        public string GetCheckTransactionStatusV3Endpoint(EnvironmentEnum environment)
        {
            return $"{HttpRequestService.GetEnvironmentBaseUri(environment, EndpointEnum.FrameV3)}{TransactionStatusEndpoint}";

        }

        public async Task<object> ConfirmPayout(Guid partnerId, string transactionId, decimal amount, CurrencyEnum currency, EnvironmentEnum environment)
        {
            var returnResponse = new Response();
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == partnerId).FirstOrDefault();
            returnResponse.RequestDateTimeUTC = DateTime.UtcNow;
            var aircashConfirmPayoutRequest = GetConfirmPayoutRequest(partnerId, transactionId, amount, currency);
            returnResponse.ServiceRequest = aircashConfirmPayoutRequest;
            var dataToSign = AircashSignatureService.ConvertObjectToString(aircashConfirmPayoutRequest);
            returnResponse.Sequence = dataToSign;
            var signature = aircashConfirmPayoutRequest.Signature;
            aircashConfirmPayoutRequest.Signature = signature;
            var aircashCreatePayoutResponse = new object();
            var response = await HttpRequestService.SendRequestAircash(aircashConfirmPayoutRequest, HttpMethod.Post, GetConfirmPayoutEndpoint(environment));
            returnResponse.ResponseDateTimeUTC = DateTime.Now;
            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                aircashCreatePayoutResponse = JsonConvert.DeserializeObject<ConfirmPayoutResponse>(response.ResponseContent);
            }
            else
            {
                aircashCreatePayoutResponse = JsonConvert.DeserializeObject<ErrorResponse>(response.ResponseContent);
            }
            returnResponse.ServiceResponse = aircashCreatePayoutResponse;
            return returnResponse;
        }
        public ConfirmPayoutRequest GetConfirmPayoutRequest(Guid partnerId, string transactionId, decimal amount, CurrencyEnum currency)
        {
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == partnerId).FirstOrDefault();
            var aircashConfirmPayoutRequest = new ConfirmPayoutRequest
            {
                PartnerId = partnerId.ToString(),
                PartnerTransactionId = transactionId,
                Amount = amount,
                CurrencyId = (int)currency,
            };
            var dataToSign = AircashSignatureService.ConvertObjectToString(aircashConfirmPayoutRequest);
            var signature = SignatureService.GenerateSignature(partnerId, dataToSign);
            aircashConfirmPayoutRequest.Signature = signature;

            return aircashConfirmPayoutRequest;
        }
        public string GetConfirmPayoutEndpoint(EnvironmentEnum environment)
        {
            return $"{HttpRequestService.GetEnvironmentBaseUri(environment, EndpointEnum.FrameV2)}{ConfirmPayoutEndpoint}";

        }
        public async Task<object> CancelPayout(Guid partnerId, string transactionId, EnvironmentEnum environment)
        {
            var returnResponse = new Response();
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == partnerId).FirstOrDefault();
            returnResponse.RequestDateTimeUTC = DateTime.UtcNow;
            var aircashCancelPayoutRequest = GetCancelPayoutRequest(partnerId, transactionId);
            returnResponse.ServiceRequest = aircashCancelPayoutRequest;
            var dataToSign = AircashSignatureService.ConvertObjectToString(aircashCancelPayoutRequest);
            returnResponse.Sequence = dataToSign;
            var signature = aircashCancelPayoutRequest.Signature;
            aircashCancelPayoutRequest.Signature = signature;
            var aircashCreatePayoutResponse = new object();
            var response = await HttpRequestService.SendRequestAircash(aircashCancelPayoutRequest, HttpMethod.Post, GetCancelPayoutEndpoint(environment));
            returnResponse.ResponseDateTimeUTC = DateTime.Now;
            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                aircashCreatePayoutResponse = JsonConvert.DeserializeObject<CancelPayoutResponse>(response.ResponseContent);
            }
            else
            {
                aircashCreatePayoutResponse = JsonConvert.DeserializeObject<ErrorResponse>(response.ResponseContent);
            }
            returnResponse.ServiceResponse = aircashCreatePayoutResponse;
            return returnResponse;
        }
        public CancelPayoutRequest GetCancelPayoutRequest(Guid partnerId, string transactionId)
        {
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == partnerId).FirstOrDefault();
            var aircashCancelPayoutRequest = new CancelPayoutRequest
            {
                PartnerId = partnerId.ToString(),
                PartnerTransactionId = transactionId
            };
            var dataToSign = AircashSignatureService.ConvertObjectToString(aircashCancelPayoutRequest);
            var signature = SignatureService.GenerateSignature(partnerId, dataToSign);
            aircashCancelPayoutRequest.Signature = signature;

            return aircashCancelPayoutRequest;
        }
        public string GetCancelPayoutEndpoint(EnvironmentEnum environment)
        {
            return $"{HttpRequestService.GetEnvironmentBaseUri(environment, EndpointEnum.FrameV2)}{CancelPayoutEndpoint}";

        }
        public async Task<Response> RefundTransaction(AircashRefundTransactionRequestV2 request)
        {
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == request.PartnerId).FirstOrDefault();
            var requestDateTime = DateTime.UtcNow;
            var refundTransactionResponse = new object();

            var dataToSign = AircashSignatureService.ConvertObjectToString(request);
            var signature = SignatureService.GenerateSignature(partner.PartnerId, dataToSign);
            request.Signature = signature;

            var response = await HttpRequestService.SendRequestAircash(request, HttpMethod.Post, $"{HttpRequestService.GetEnvironmentBaseUri(partner.Environment, EndpointEnum.Frame)}{RefundTransactionEndpoint}");
            var responseDateTime = DateTime.UtcNow;
            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                refundTransactionResponse = JsonConvert.DeserializeObject<AircashRefundTransactionResponseV2>(response.ResponseContent);           
            }
            else
            {
                refundTransactionResponse = JsonConvert.DeserializeObject<ErrorRefundResponseV2>(response.ResponseContent);
            }
            var frontResponse = new Response
            {
                ServiceRequest = request,
                ServiceResponse = refundTransactionResponse,
                Sequence = dataToSign,
                RequestDateTimeUTC = requestDateTime,
                ResponseDateTimeUTC = responseDateTime
            };
            return frontResponse;
        }
    }
}
