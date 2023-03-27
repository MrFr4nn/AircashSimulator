using Domain.Entities.Enum;
using Newtonsoft.Json;
using Services.HttpRequest;
using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace Services.MatchService
{
    public class Response
    {
        public object ServiceRequest { get; set; }
        public AircashMatchPersonalDataRS ServiceResponse { get; set; }
        public string Sequence { get; set; }
        public DateTime RequestDateTimeUTC { get; set; }
        public DateTime ResponseDateTimeUTC { get; set; }
    }
    public class MatchService : IMatchService
    {
        private IHttpRequestService HttpRequestService;

        private readonly string MatchCompareIdentity = "Match/CompareIdentity";

        public MatchService(IHttpRequestService httpRequestService)
        {
            HttpRequestService = httpRequestService;
        }
        public async Task<Response> CompareIdentity(AircashMatchPersonalData aircashMatchPersonalData) {
            var returnResponse = new Response();
            //var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == aircashMatchPersonalData.PartnerID).FirstOrDefault();
            returnResponse.RequestDateTimeUTC = DateTime.UtcNow;
            var request = new AircashMatchPersonalDataRQ()
            {
                PartnerID = aircashMatchPersonalData.PartnerID.ToString(),
                AircashUser = aircashMatchPersonalData.AircashUser,
                PartnerUser = aircashMatchPersonalData.PartnerUser,
            };
            returnResponse.ServiceRequest = request;
            var response = await HttpRequestService.SendRequestAircash(request, HttpMethod.Post, $"{HttpRequestService.GetEnvironmentBaseUri( EnvironmentEnum.Staging, EndpointEnum.M2)}{MatchCompareIdentity}");
            returnResponse.ServiceResponse = JsonConvert.DeserializeObject<AircashMatchPersonalDataRS>(response.ResponseContent);
            returnResponse.ResponseDateTimeUTC = DateTime.UtcNow;

            return returnResponse;
        }
    }
}
