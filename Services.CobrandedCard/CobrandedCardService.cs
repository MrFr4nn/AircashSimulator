using AircashSignature;
using AircashSimulator.Configuration;
using DataAccess;
using Domain.Entities.Enum;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Service.Settings;
using Services.HttpRequest;
using Services.Signature;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Services.CobrandedCard
{
    public class CobrandedCardService : ICobrandedCardService
    {
        private AircashSimulatorContext AircashSimulatorContext;
        private ISignatureService SignatureService;
        private IHttpRequestService HttpRequestService;
        private ISettingsService SettingsService;
        private readonly string CobrandedCardEndpoint = "CobrandedCard/OrderCard";
        private readonly string UpdateCardOrderStatusEndpoint = "Admin/UpdateCardOrderStatus";
        private readonly string UpdateCardStatusEndpoint = "Admin/PartnerUpdateCardStatus";
        public CobrandedCardService(AircashSimulatorContext aircashSimulatorContext, ISignatureService signatureService, IHttpRequestService httpRequestService, ISettingsService settingsService)
        {
            AircashSimulatorContext = aircashSimulatorContext;
            SignatureService = signatureService;
            HttpRequestService = httpRequestService;
            SettingsService = settingsService;
        }
        public async Task<Response> OrderNewCard(OrderCardRequest request)
        {
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == request.PartnerID).FirstOrDefault();
            var requestDateTime = DateTime.UtcNow;
            var orderCardResponse = new object();

            var dataToSign = AircashSignatureService.ConvertObjectToString(request);
            var signature = SignatureService.GenerateSignature(partner.PartnerId, dataToSign);
            request.Signature = signature;
            var response = await HttpRequestService.SendRequestAircash(request, HttpMethod.Post, $"{HttpRequestService.GetEnvironmentBaseUri(EnvironmentEnum.Staging, EndpointEnum.SalesV2)}{CobrandedCardEndpoint}");
            var responseDateTime = DateTime.UtcNow;
            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                orderCardResponse = JsonConvert.DeserializeObject<OrderCardRequest>(response.ResponseContent);
            }
            else
            {
                orderCardResponse = JsonConvert.DeserializeObject<ErrorOrderCardResponse>(response.ResponseContent);
            }
            var frontResponse = new Response
            {
                ServiceRequest = request,
                ServiceResponse = orderCardResponse,
                Sequence = dataToSign,
                RequestDateTimeUTC = requestDateTime,
                ResponseDateTimeUTC = responseDateTime
            };
            return frontResponse;
        }
        public async Task<Response> UpadateCardStatus(UpdateStatusCardRQ request)
        {

            var requestDateTime = DateTime.UtcNow;
            var updateCardStatusResponse = new object();

            var dataToSign = AircashSignatureService.ConvertObjectToString(request);
            var signature = AircashSignatureService.GenerateSignature(dataToSign, SettingsService.TestAdminPrivateKeyPath, SettingsService.TestAdminPrivateKeyPass);
            request.Signature = signature;
            var response = await HttpRequestService.SendRequestAircash(request, HttpMethod.Post, $"{HttpRequestService.GetEnvironmentBaseUri(EnvironmentEnum.Staging, EndpointEnum.M3)}{UpdateCardStatusEndpoint}");
            var responseDateTime = DateTime.UtcNow;
            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                updateCardStatusResponse = JsonConvert.DeserializeObject<UpdateStatusCardRQ>(response.ResponseContent);
            }
            else
            {
                //orderCardResponse = JsonConvert.DeserializeObject<ErrorOrderCardResponse>(response.ResponseContent);
            }
            var frontResponse = new Response
            {
                ServiceRequest = request,
                ServiceResponse = updateCardStatusResponse,
                Sequence = dataToSign,
                RequestDateTimeUTC = requestDateTime,
                ResponseDateTimeUTC = responseDateTime
            };
            return frontResponse;
        }
        public async Task<Response> UpdateCardOrderStatus(UpdateCardOrderStatusRQ request)
        {
            var requestDateTime = DateTime.UtcNow;
            var updateCardOrderStatusResponse = new object();

            var dataToSign = AircashSignatureService.ConvertObjectToString(request);
            var signature = AircashSignatureService.GenerateSignature(dataToSign, SettingsService.TestAdminPrivateKeyPath, SettingsService.TestAdminPrivateKeyPass);
            request.Signature = signature;
            var response = await HttpRequestService.SendRequestAircash(request, HttpMethod.Post, $"{HttpRequestService.GetEnvironmentBaseUri(EnvironmentEnum.Staging, EndpointEnum.M3)}{UpdateCardOrderStatusEndpoint}");
            var responseDateTime = DateTime.UtcNow;
            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                updateCardOrderStatusResponse = JsonConvert.DeserializeObject<UpdateCardOrderStatusRQ>(response.ResponseContent);
            }
            else
            {
                //orderCardResponse = JsonConvert.DeserializeObject<ErrorOrderCardResponse>(response.ResponseContent);
            }
            var frontResponse = new Response
             {
                 ServiceRequest = request,
                 ServiceResponse = updateCardOrderStatusResponse,
                 Sequence = dataToSign,
                 RequestDateTimeUTC = requestDateTime,
                 ResponseDateTimeUTC = responseDateTime
             };
             return frontResponse;
        }
    }
}
