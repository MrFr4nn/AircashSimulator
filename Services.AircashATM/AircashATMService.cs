using AircashSignature;
using DataAccess;
using Domain.Entities.Enum;
using Newtonsoft.Json;
using Services.HttpRequest;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashATM
{
    public class Response
    {
        public object ServiceRequest { get; set; }
        public object ServiceResponse { get; set; }
        public string Sequence { get; set; }
        public DateTime RequestDateTimeUTC { get; set; }
        public DateTime ResponseDateTimeUTC { get; set; }
    }
    public class AircashATMService: IAircashATMService
    {
        private AircashSimulatorContext AircashSimulatorContext;
        private IHttpRequestService HttpRequestService;

        private readonly string UseOneTimePayoutCodeEndpoint = "OneTimeCode/UseOneTimePayoutCode";
        private readonly string CancelTransactionEndpoint = "OneTimeCode/CancelTransaction";
        public AircashATMService(AircashSimulatorContext aircashSimulatorContext, IHttpRequestService httpRequestService)
        {
            AircashSimulatorContext = aircashSimulatorContext;
            HttpRequestService = httpRequestService;
        }

        public async Task<object> UseOneTimePayoutCode(UseOneTimePayoutCodeRQ useOneTimePayoutCodeRQ)
        {
            var response = new Response();
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == new Guid(useOneTimePayoutCodeRQ.PartnerGuid)).FirstOrDefault();

            useOneTimePayoutCodeRQ.PartnerTransactionID = Guid.NewGuid().ToString();

            response.RequestDateTimeUTC = DateTime.UtcNow;
            response.ServiceRequest = useOneTimePayoutCodeRQ;
            response.Sequence = AircashSignatureService.ConvertObjectToString(useOneTimePayoutCodeRQ);

            useOneTimePayoutCodeRQ.Signature = AircashSignatureService.GenerateSignature(response.Sequence, partner.PrivateKey, partner.PrivateKeyPass);

            var httpResponse = await HttpRequestService.SendRequestAircash(useOneTimePayoutCodeRQ, HttpMethod.Post, $"{HttpRequestService.GetEnvironmentBaseUri(partner.Environment, EndpointEnum.M2)}{UseOneTimePayoutCodeEndpoint}");

            response.ServiceResponse = JsonConvert.DeserializeObject<UseOneTimePayoutCodeRS>(httpResponse.ResponseContent);
            response.ResponseDateTimeUTC = DateTime.UtcNow;

            return response;
        }
        public async Task<object> CancelTransaction(CancelTransactionRQ cancelTransactionRQ)
        {
            var response = new Response();
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == new Guid(cancelTransactionRQ.PartnerGuid)).FirstOrDefault();

            response.RequestDateTimeUTC = DateTime.UtcNow;
            response.ServiceRequest = cancelTransactionRQ;
            response.Sequence = AircashSignatureService.ConvertObjectToString(cancelTransactionRQ);

            cancelTransactionRQ.Signature = AircashSignatureService.GenerateSignature(response.Sequence, partner.PrivateKey, partner.PrivateKeyPass);

            var httpResponse = await HttpRequestService.SendRequestAircash(cancelTransactionRQ, HttpMethod.Post, $"{HttpRequestService.GetEnvironmentBaseUri(partner.Environment, EndpointEnum.M2)}{CancelTransactionEndpoint}");

            response.ServiceResponse = JsonConvert.DeserializeObject<UseOneTimePayoutCodeRS>(httpResponse.ResponseContent);
            response.ResponseDateTimeUTC = DateTime.UtcNow;

            return response;
        }
    }
}
