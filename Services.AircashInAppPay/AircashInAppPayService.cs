using System;
using AircashSignature;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using Domain.Entities.Enum;
using System.Threading.Tasks;
using AircashSimulator.Configuration;
using DataAccess;
using Services.HttpRequest;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

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
        private AircashConfiguration AircashConfiguration;
        private const string GenerateTransactionURL = "https://localhost:44317/#!/success";
        public AircashInAppPayService(AircashSimulatorContext aircashSimulatorContext, IHttpRequestService httpRequestService, IOptionsMonitor<AircashConfiguration> aircashConfiguration) 
        {
            AircashSimulatorContext= aircashSimulatorContext;
            HttpRequestService= httpRequestService;
            AircashConfiguration= aircashConfiguration.CurrentValue;
        }
        public async Task<object> GenerateTransaction(GenerateTransactionRequest generateTransactionRequest) 
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
                SuccessURL = GenerateTransactionURL,
                ConfirmURL = GenerateTransactionURL,
                DeclineURL = GenerateTransactionURL,
                ValidUntilUTC = DateTime.UtcNow.AddMinutes(5)
            };
            returnResponse.ServiceRequest = request;
            returnResponse.Sequence = AircashSignatureService.ConvertObjectToString(request);

            request.Signature = AircashSignatureService.GenerateSignature(returnResponse.Sequence, partner.PrivateKey, partner.PrivateKeyPass);

            var response = await HttpRequestService.SendRequestAircash(request, HttpMethod.Post, $"{HttpRequestService.GetEnvironmentBaseUri(partner.Environment, EndpointEnum.M3)}{AircashConfiguration.AircashPayGenerateTransaction}");

            returnResponse.ServiceResponse = JsonConvert.DeserializeObject<GenerateTransactionApiResponse>(response.ResponseContent);
            returnResponse.ResponseDateTimeUTC = DateTime.UtcNow;


            return returnResponse;
        }
    }
}
