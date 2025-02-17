﻿using AircashSignature;
using DataAccess;
using Domain.Entities;
using Domain.Entities.Enum;
using Newtonsoft.Json;
using Service.Settings;
using Services.HttpRequest;
using Services.Signature;
using System;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace Services.AircashPaymentAndPayout
{

    public class Response
    {
        public object ServiceRequest { get; set; }
        public object ServiceResponse { get; set; }
        public string Sequence { get; set; }
        public DateTime RequestDateTimeUTC { get; set; }
        public DateTime ResponseDateTimeUTC { get; set; }
    }
    public class AircashPaymentAndPayoutService : IAircashPaymentAndPayoutService
    {
        private ISettingsService SettingsService;
        private ISignatureService SignatureService;
        private AircashSimulatorContext AircashSimulatorContext;
        private IHttpRequestService HttpRequestService;

        private readonly string CheckCodeEndpoint = "SalesPartner/CheckCode";
        private readonly string CheckCodeV2Endpoint = "SalesPartnerV2/CheckCode";
        private readonly string CheckDigitsV2Endpoint = "SalesPartnerV2/CheckDigits";
        private readonly string ConfirmTransactionEndpoint = "SalesPartner/ConfirmTransaction";
        private readonly string PaymentCancelTransactionEndpoint = "SalesPartner/CancelTransaction";
        private readonly string PaymentCheckTransactionStatusEndpoint = "SalesPartner/CheckTransactionStatus";

        public AircashPaymentAndPayoutService(AircashSimulatorContext aircashSimulatorContext, IHttpRequestService httpRequestService, ISettingsService settingsService, ISignatureService signatureService)
        {
            AircashSimulatorContext = aircashSimulatorContext;
            HttpRequestService = httpRequestService;
            SettingsService = settingsService;
            SignatureService = signatureService;
        }

        public async Task<object> CheckCode(string barCode, string locationID, Guid partnerId, EnvironmentEnum environment) 
        {
            Response returnResponse = new Response();
            var checkCodeResponse = new object();
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == partnerId).FirstOrDefault();
            var requestDateTimeUTC = DateTime.UtcNow;
            returnResponse.RequestDateTimeUTC = requestDateTimeUTC;
            var checkCodeRequest = new CheckCodeRequest()
            {
                PartnerID = partnerId.ToString(),
                BarCode = barCode,
                LocationID = locationID           
            };
            var sequence = AircashSignatureService.ConvertObjectToString(checkCodeRequest);
            returnResponse.Sequence = sequence;
            var signature = SignatureService.GenerateSignature(partnerId, sequence);
            checkCodeRequest.Signature = signature;
            returnResponse.ServiceRequest = checkCodeRequest;
            var response = await HttpRequestService.SendRequestAircash(checkCodeRequest, HttpMethod.Post, $"{HttpRequestService.GetEnvironmentBaseUri(environment, EndpointEnum.M2)}" +$"{CheckCodeEndpoint}");
            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                checkCodeResponse= JsonConvert.DeserializeObject<CheckCodeResponse>(response.ResponseContent);
                var responseDateTimeUTC = DateTime.UtcNow;
                returnResponse.ResponseDateTimeUTC = responseDateTimeUTC;
            }
            else
            {
                checkCodeResponse = JsonConvert.DeserializeObject<ErrorResponse>(response.ResponseContent);
                var responseDateTimeUTC = DateTime.UtcNow;
                returnResponse.ResponseDateTimeUTC = responseDateTimeUTC;
            }
            returnResponse.ServiceResponse = checkCodeResponse;
            return returnResponse;

        }

        public async Task<object> CheckCodeV2(string barCode, string locationID, Guid partnerId, EnvironmentEnum environment)
        {
            Response returnResponse = new Response();
            var checkCodeResponse = new object();
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == partnerId).FirstOrDefault();
            var requestDateTimeUTC = DateTime.UtcNow;
            returnResponse.RequestDateTimeUTC = requestDateTimeUTC;
            var checkCodeRequest = new CheckCodeRequest()
            {
                PartnerID = partnerId.ToString(),
                BarCode = barCode,
                LocationID = locationID
            };
            var sequence = AircashSignatureService.ConvertObjectToString(checkCodeRequest);
            returnResponse.Sequence = sequence;
            var signature = SignatureService.GenerateSignature(partnerId, sequence);
            checkCodeRequest.Signature = signature;
            returnResponse.ServiceRequest = checkCodeRequest;
            var response = await HttpRequestService.SendRequestAircash(checkCodeRequest, HttpMethod.Post, $"{HttpRequestService.GetEnvironmentBaseUri(environment, EndpointEnum.SalesV2)}" + $"{CheckCodeV2Endpoint}");
            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                checkCodeResponse = JsonConvert.DeserializeObject<CheckCodeV2Response>(response.ResponseContent);
                var responseDateTimeUTC = DateTime.UtcNow;
                returnResponse.ResponseDateTimeUTC = responseDateTimeUTC;
            }
            else
            {
                checkCodeResponse = JsonConvert.DeserializeObject<ErrorResponse>(response.ResponseContent);
                var responseDateTimeUTC = DateTime.UtcNow;
                returnResponse.ResponseDateTimeUTC = responseDateTimeUTC;
            }
            returnResponse.ServiceResponse = checkCodeResponse;
            return returnResponse;

        }


        public async Task<object> CheckDigitsV2(string digitCode, string locationID, string partnerID, int currencyID, EnvironmentEnum environment)
        {
            Response returnResponse = new Response();
            var checkDigitsResponse = new object();
            var partnerGuid = new Guid(partnerID);
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == partnerGuid).FirstOrDefault();
            var requestDateTimeUTC = DateTime.UtcNow;
            returnResponse.RequestDateTimeUTC = requestDateTimeUTC;
            var checkDigitsRequest = new CheckDigitsRequest()
            {
                PartnerID = partnerID.ToString(),
                DigitCode = digitCode,
                LocationID = locationID,
                CurrencyID = currencyID
            };
            var sequence = AircashSignatureService.ConvertObjectToString(checkDigitsRequest);
            returnResponse.Sequence = sequence;
            checkDigitsRequest.Signature = SignatureService.GenerateSignature(partnerGuid, sequence);
            returnResponse.ServiceRequest = checkDigitsRequest;
            var response = await HttpRequestService.SendRequestAircash(checkDigitsRequest, HttpMethod.Post, $"{HttpRequestService.GetEnvironmentBaseUri(environment, EndpointEnum.SalesV2)}" + $"{CheckDigitsV2Endpoint}");
            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                checkDigitsResponse = JsonConvert.DeserializeObject<CheckDigitsV2Response>(response.ResponseContent);
                var responseDateTimeUTC = DateTime.UtcNow;
                returnResponse.ResponseDateTimeUTC = responseDateTimeUTC;
            }
            else
            {
                checkDigitsResponse = JsonConvert.DeserializeObject<ErrorResponse>(response.ResponseContent);
                var responseDateTimeUTC = DateTime.UtcNow;
                returnResponse.ResponseDateTimeUTC = responseDateTimeUTC;
            }
            returnResponse.ServiceResponse = checkDigitsResponse;
            return returnResponse;
        }

        public async Task<object> ConfirmTransaction(string barCode, string locationID, Guid partnerId, string userId, string partnerTransactionID, EnvironmentEnum environment)
        {
            Response returnResponse = new Response();
            var confirmTransactionResponse = new object();
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == partnerId).FirstOrDefault();
            var requestDateTimeUTC = DateTime.UtcNow;
            returnResponse.RequestDateTimeUTC = requestDateTimeUTC;
            var confirmTransactionRequest = new ConfirmTransactionRequest()
            {
                PartnerID = partnerId.ToString(),
                BarCode = barCode,
                PartnerTransactionID= partnerTransactionID.ToString(),
                LocationID = locationID
            };
            var sequence = AircashSignatureService.ConvertObjectToString(confirmTransactionRequest);
            returnResponse.Sequence = sequence;
            var signature = SignatureService.GenerateSignature(partnerId, sequence);
            confirmTransactionRequest.Signature = signature;
            returnResponse.ServiceRequest = confirmTransactionRequest;
            var response = await HttpRequestService.SendRequestAircash(confirmTransactionRequest, HttpMethod.Post, $"{HttpRequestService.GetEnvironmentBaseUri(environment, EndpointEnum.M2)}" + $"{ConfirmTransactionEndpoint}");
            var responseDateTimeUTC = DateTime.UtcNow;
            returnResponse.ResponseDateTimeUTC = responseDateTimeUTC;
            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                ConfirmTransactionResponse successResponse = JsonConvert.DeserializeObject<ConfirmTransactionResponse>(response.ResponseContent);
                ServiceEnum serviceId;
                if (successResponse.Amount >= 0) { serviceId = ServiceEnum.AircashSalePartnerPayment; }
                else { serviceId = ServiceEnum.AircashSalePartnerPayout; }
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
            returnResponse.ServiceResponse = confirmTransactionResponse;
            return returnResponse;

        }

        public async Task<object> CheckTransactionStatus(string partnerTransactionID, Guid partnerId, EnvironmentEnum environment)
        {
            Response returnResponse = new Response();
            var checkTransactionStatusResponse = new object();
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == partnerId).FirstOrDefault();
            var requestDateTimeUTC = DateTime.UtcNow;
            returnResponse.RequestDateTimeUTC = requestDateTimeUTC;
            var checkTransactionStatusRequest = new CheckTransactionStatusRequest()
            {
                PartnerID = partnerId.ToString(),
                PartnerTransactionID = partnerTransactionID
            };
            var sequence = AircashSignatureService.ConvertObjectToString(checkTransactionStatusRequest);
            returnResponse.Sequence = sequence;
            var signature = SignatureService.GenerateSignature(partnerId, sequence);
            checkTransactionStatusRequest.Signature = signature;
            returnResponse.ServiceRequest = checkTransactionStatusRequest;
            var response = await HttpRequestService.SendRequestAircash(checkTransactionStatusRequest, HttpMethod.Post, $"{HttpRequestService.GetEnvironmentBaseUri(environment, EndpointEnum.M2)}" + $"{PaymentCheckTransactionStatusEndpoint}");
            var responseDateTimeUTC = DateTime.UtcNow;
            returnResponse.ResponseDateTimeUTC = responseDateTimeUTC;
            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                checkTransactionStatusResponse = JsonConvert.DeserializeObject<CheckTransactionStatusResponse>(response.ResponseContent);
            }
            else
            {
                checkTransactionStatusResponse = JsonConvert.DeserializeObject<ErrorResponse>(response.ResponseContent);
            }
            returnResponse.ServiceResponse = checkTransactionStatusResponse;
            return returnResponse;

        }

        public async Task<object> CancelTransaction(string partnerTransactionID, string locationID, Guid partnerId, string userId, EnvironmentEnum environment)
        {
            Response returnResponse = new Response();
            var cancelTransactionResponse = new object();
            var transaction = AircashSimulatorContext.Transactions.Where(x => x.TransactionId == partnerTransactionID).FirstOrDefault();
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == partnerId).FirstOrDefault();
            var requestDateTimeUTC = DateTime.UtcNow;
            returnResponse.RequestDateTimeUTC = requestDateTimeUTC;
            var cancelTransactionRequest = new CancelTransactionRequest()
            {
                PartnerID = partnerId.ToString(),
                LocationID=locationID,
                PartnerTransactionID = partnerTransactionID
            };
            var sequence = AircashSignatureService.ConvertObjectToString(cancelTransactionRequest);
            returnResponse.Sequence = sequence;
            var signature = SignatureService.GenerateSignature(partnerId, sequence);
            cancelTransactionRequest.Signature = signature;
            returnResponse.ServiceRequest = cancelTransactionRequest;
            var response = await HttpRequestService.SendRequestAircash(cancelTransactionRequest, HttpMethod.Post, $"{HttpRequestService.GetEnvironmentBaseUri(environment, EndpointEnum.M2)}" + $"{PaymentCancelTransactionEndpoint}");
            var responseDateTimeUTC = DateTime.UtcNow;
            returnResponse.ResponseDateTimeUTC = responseDateTimeUTC;
            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                cancelTransactionResponse = (response.ResponseContent).ToString();
                AircashSimulatorContext.Transactions.Add(new TransactionEntity
                {
                    Amount = transaction.Amount,
                    ISOCurrencyId = (CurrencyEnum)partner.CurrencyId,
                    PartnerId = partnerId,
                    AircashTransactionId = transaction.AircashTransactionId,
                    TransactionId = partnerTransactionID,
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
            returnResponse.ServiceResponse = cancelTransactionResponse;
            return returnResponse;

        }
    }
}
