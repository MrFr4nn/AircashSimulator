﻿using System;
using AircashSignature;
using System.Linq;
using System.Net.Http;
using Domain.Entities.Enum;
using System.Threading.Tasks;
using DataAccess;
using Services.HttpRequest;
using Newtonsoft.Json;
using Domain.Entities;
using Service.Settings;

namespace Services.AircashInAppPay
{
    public class Response
    {
        public object ServiceRequest { get; set; }
        public object ServiceResponse { get; set; }
        public string Sequence { get; set; }
        public DateTime RequestDateTimeUTC { get; set; }
        public DateTime ResponseDateTimeUTC { get; set; }
    }
    public class AircashInAppPayService : IAircashInAppPayService
    {
        private AircashSimulatorContext AircashSimulatorContext;
        private IHttpRequestService HttpRequestService;
        private ISettingsService SettingsService;
        private const string GenerateTransactionSuccessURL = "https://dev-simulator.aircash.eu/#!/success";
        private const string GenerateTransactionConfirmURL = "https://dev-simulator-api.aircash.eu/api/AircashInAppPay/ConfirmTransaction";
        private const string GenerateTransactionDeclineURL = "https://dev-simulator.aircash.eu/#!/decline";

        private readonly string AircashPayGenerateTransactionEndpoint = "AircashPay/GenerateTransaction";
        private readonly string RefundTransactionEndpoint = "AircashPay/RefundTransaction";
        private readonly string CheckTransactionStatusEndpoint = "AircashPay/CheckTransactionStatus";
        public AircashInAppPayService(AircashSimulatorContext aircashSimulatorContext, IHttpRequestService httpRequestService, ISettingsService settingsService) 
        {
            AircashSimulatorContext= aircashSimulatorContext;
            HttpRequestService= httpRequestService;
            SettingsService= settingsService;
        }
        public async Task<object> GenerateTransaction(GenerateTransactionRequest generateTransactionRequest, EnvironmentEnum environment) 
        {
            Response returnResponse = new Response();
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == generateTransactionRequest.PartnerID).FirstOrDefault();
            returnResponse.RequestDateTimeUTC = DateTime.UtcNow;
            var request = new GenerateTransactionApiRequest()
            {
                PartnerID = generateTransactionRequest.PartnerID,
                Amount = generateTransactionRequest.Amount,
                CurrencyID = partner.CurrencyId,
                PartnerTransactionID = Guid.NewGuid().ToString(),
                Description = generateTransactionRequest.Description,
                SuccessURL = GenerateTransactionSuccessURL,
                ConfirmURL = GenerateTransactionConfirmURL,
                DeclineURL = GenerateTransactionDeclineURL,
                ValidUntilUTC = DateTime.UtcNow.AddMinutes(5)
            };
            returnResponse.ServiceRequest = request;
            returnResponse.Sequence = AircashSignatureService.ConvertObjectToString(request);

            request.Signature = AircashSignatureService.GenerateSignature(returnResponse.Sequence, partner.PrivateKey, partner.PrivateKeyPass);

            var response = await HttpRequestService.SendRequestAircash(request, HttpMethod.Post, $"{HttpRequestService.GetEnvironmentBaseUri(environment, EndpointEnum.M3)}{AircashPayGenerateTransactionEndpoint}");

            returnResponse.ServiceResponse = JsonConvert.DeserializeObject<GenerateTransactionApiResponse>(response.ResponseContent);
            returnResponse.ResponseDateTimeUTC = DateTime.UtcNow;


            return returnResponse;
        }
        public async Task<object> RefundTransaction(RefundTransactionRequest refundTransactionRequest, EnvironmentEnum environment)
        {
            Response returnResponse = new Response();
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == refundTransactionRequest.PartnerID).FirstOrDefault();

            returnResponse.RequestDateTimeUTC = DateTime.UtcNow;

            var request = new RefundTransactionApiRQ() {
                PartnerID = refundTransactionRequest.PartnerID.ToString(),
                PartnerTransactionID = refundTransactionRequest.PartnerTransactionID,
                RefundTransactionID = Guid.NewGuid().ToString(),
                Amount = refundTransactionRequest.Amount,
            };

            returnResponse.ServiceRequest = request;
            returnResponse.Sequence = AircashSignatureService.ConvertObjectToString(request);

            request.Signature = AircashSignatureService.GenerateSignature(returnResponse.Sequence, partner.PrivateKey, partner.PrivateKeyPass);

            var response = await HttpRequestService.SendRequestAircash(request, HttpMethod.Post, $"{HttpRequestService.GetEnvironmentBaseUri(environment, EndpointEnum.M3)}{RefundTransactionEndpoint}");

            returnResponse.ServiceResponse = JsonConvert.DeserializeObject<RefundTrancsactionApiRS>(response.ResponseContent);
            returnResponse.ResponseDateTimeUTC = DateTime.UtcNow;

            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                returnResponse.ServiceResponse = JsonConvert.DeserializeObject<RefundTrancsactionApiRS>(response.ResponseContent);
                var transaction = AircashSimulatorContext.Transactions.FirstOrDefault(x => x.TransactionId == new Guid(refundTransactionRequest.PartnerTransactionID));

                AircashSimulatorContext.Transactions.Add(new TransactionEntity
                {
                    Amount = refundTransactionRequest.Amount,
                    ISOCurrencyId = transaction.ISOCurrencyId,
                    AircashTransactionId = ((RefundTrancsactionApiRS)returnResponse.ServiceResponse).TransactionID,
                    TransactionId = new Guid(refundTransactionRequest.PartnerTransactionID),
                    ServiceId = ServiceEnum.AircashPayCancellation,
                    RequestDateTimeUTC = returnResponse.RequestDateTimeUTC,
                    ResponseDateTimeUTC = returnResponse.ResponseDateTimeUTC,
                    PointOfSaleId = transaction.PointOfSaleId
                });
                AircashSimulatorContext.SaveChanges();
            }
            else
            {
                returnResponse.ServiceResponse = JsonConvert.DeserializeObject<ErrorResponse>(response.ResponseContent);
            }

            return returnResponse;
        }

        public async Task<object> CheckTransactionStatus(Guid partnerId, Guid partnerTransactionId, EnvironmentEnum environment)
        {
            Response returnResponse = new Response();
            returnResponse.RequestDateTimeUTC = DateTime.UtcNow;
            var request = new CheckTransactionStatusRQ()
            {
               PartnerId = partnerId.ToString(),
               PartnerTransactionId = partnerTransactionId.ToString(),
            };
            returnResponse.ServiceRequest = request;
            returnResponse.Sequence = AircashSignatureService.ConvertObjectToString(request);

            request.Signature = AircashSignatureService.GenerateSignature(returnResponse.Sequence, SettingsService.AircashSimulatorPrivateKeyPath, SettingsService.AircashSimulatorPrivateKeyPass);

            var response = await HttpRequestService.SendRequestAircash(request, HttpMethod.Post, $"{HttpRequestService.GetEnvironmentBaseUri(environment, EndpointEnum.M3)}{CheckTransactionStatusEndpoint}");

            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                returnResponse.ServiceResponse = JsonConvert.DeserializeObject<CheckTransactionStatusRS>(response.ResponseContent);
            }
            else
            {
                returnResponse.ServiceResponse = JsonConvert.DeserializeObject<ErrorResponseMessage>(response.ResponseContent);
            } 
            returnResponse.ResponseDateTimeUTC = DateTime.UtcNow;
            return returnResponse;
        }
    }
}
