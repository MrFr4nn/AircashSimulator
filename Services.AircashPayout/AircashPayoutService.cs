using AircashSimulator.Configuration;
using DataAccess;
using Microsoft.Extensions.Options;
using Services.HttpRequest;
using System;
using System.Linq;
using AircashSignature;
using System.Threading.Tasks;
using System.Net.Http;
using Newtonsoft.Json;

namespace Services.AircashPayout
{
    public class AircashPayoutService : IAircashPayoutService
    {
        private AircashSimulatorContext AircashSimulatorContext;
        private IHttpRequestService HttpRequestService;
        private AbonConfiguration AbonConfiguration;

        public AircashPayoutService(AircashSimulatorContext aircashSimulatorContext, IHttpRequestService httpRequestService, IOptionsMonitor<AbonConfiguration> abonConfiguration)
        {
            AircashSimulatorContext = aircashSimulatorContext;
            HttpRequestService = httpRequestService;
            AbonConfiguration = abonConfiguration.CurrentValue;
        }

        public async Task<object> CheckUser(string phoneNumber, string partnerUserId, Guid partnerId)
        {
            var checkUserResponse = new object();
            var partner = AircashSimulatorContext.Partners.Where(x => x.PartnerId == partnerId).FirstOrDefault();
            var checkUserRequest = new CheckUserRequest()
            {
                PartnerId=partnerId.ToString(),
                PhoneNumber=phoneNumber,
                PartnerUserId=partnerUserId
                
            };
            var sequence = AircashSignatureService.ConvertObjectToString(checkUserRequest);
            var signature = AircashSignatureService.GenerateSignature(sequence, partner.PrivateKey, partner.PrivateKeyPass);
            checkUserRequest.Signature = signature;
            var response = await HttpRequestService.SendRequestAircash(checkUserRequest, HttpMethod.Post, $"{AbonConfiguration.BaseUrl}{AbonConfiguration.CheckUserEndpoint}");
            if (response.ResponseCode == System.Net.HttpStatusCode.OK)
            {
                var successResponse = JsonConvert.DeserializeObject<CheckUserResponse>(response.ResponseContent);
            }
            else
            {
                //checkUserResponse = JsonConvert.DeserializeObject<ErrorResponse>(response.ResponseContent);
            }
            return checkUserResponse;
        }
    }
}
