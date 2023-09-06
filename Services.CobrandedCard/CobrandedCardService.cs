using AircashSignature;
using AircashSimulator.Configuration;
using DataAccess;
using Domain.Entities.Enum;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
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
        private readonly string CobrandedCardEndpoint = "CobrandedCard/OrderCard";
        public CobrandedCardService(AircashSimulatorContext aircashSimulatorContext,ISignatureService signatureService, IHttpRequestService httpRequestService)
        {
            AircashSimulatorContext = aircashSimulatorContext;
            SignatureService = signatureService;
            HttpRequestService = httpRequestService;
        }
        public async Task<Response> OrderNewCard(OrderCardRequest request)
        {
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == request.PartnerID).FirstOrDefault();
            var requestDateTime = DateTime.UtcNow;
            var orderCardResponse = new object();

            var dataToSign = AircashSignatureService.ConvertObjectToString(request);
            var signature = SignatureService.GenerateSignature(partner.PartnerId, dataToSign);
            request.Signature = signature;
            var response = await HttpRequestService.SendRequestAircash(request, HttpMethod.Post, $"{HttpRequestService.GetEnvironmentBaseUri(partner.Environment, EndpointEnum.SalesV2)}{CobrandedCardEndpoint}");
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
    }
}
