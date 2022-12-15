
using AircashSimulator.Configuration;
using DataAccess;
using Domain.Entities.Enum;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Services.HttpRequest;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace Services.MatchService
{
    public class Response
    {
        public object ServiceRequest { get; set; }
        public object ServiceResponse { get; set; }
        public string Sequence { get; set; }
        public DateTime RequestDateTimeUTC { get; set; }
        public DateTime ResponseDateTimeUTC { get; set; }
    }
    public class MatchService : IMatchService
    {
        private AircashSimulatorContext AircashSimulatorContext;
        private IHttpRequestService HttpRequestService;
        private AircashConfiguration AircashConfiguration;

        public MatchService(AircashSimulatorContext aircashSimulatorContext, IHttpRequestService httpRequestService, IOptionsMonitor<AircashConfiguration> aircashConfiguration)
        {
            AircashSimulatorContext = aircashSimulatorContext;
            HttpRequestService = httpRequestService;
            AircashConfiguration = aircashConfiguration.CurrentValue;
        }
        public async Task<AircashMatchPersonalDataRS> CompareIdentity(AircashMatchPersonalData aircashMatchPersonalData) {
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == aircashMatchPersonalData.PartnerID).FirstOrDefault();
            var request = new AircashMatchPersonalDataRQ()
            {
                PartnerID = aircashMatchPersonalData.PartnerID.ToString(),
                AircashUser = aircashMatchPersonalData.AircashUser,
                PartnerUser = aircashMatchPersonalData.PartnerUser,
            };
            var response = await HttpRequestService.SendRequestAircash(request, HttpMethod.Post, $"{HttpRequestService.GetEnvironmentBaseUri(partner.Environment, EndpointEnum.M2)}{AircashConfiguration.MatchCompareIdentity}");
            var returnResponse = JsonConvert.DeserializeObject<AircashMatchPersonalDataRS>(response.ResponseContent);

            return returnResponse;
        }
    }
}
