using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using AircashSimulator.Configuration;
using Microsoft.Extensions.Options;
using Domain.Entities.Enum;
using Newtonsoft.Json;

namespace Services.HttpRequest
{
    public class HttpRequestService : IHttpRequestService
    {
        private AircashConfiguration AircashConfiguration;
        private AbonConfiguration AbonConfiguration;
        private readonly HttpClient HttpClient;
        public HttpRequestService(HttpClient httpClient, IOptionsMonitor<AircashConfiguration> aircashConfiguration, IOptionsMonitor<AbonConfiguration> abonConfiguration)
        {
            HttpClient = httpClient;
            AircashConfiguration = aircashConfiguration.CurrentValue;
            AbonConfiguration = abonConfiguration.CurrentValue;
        }

        public async Task<HttpResponse> SendRequestAircash(object toSend, HttpMethod method, string uri)
        {
            
            using (var request = new HttpRequestMessage(method, uri))
            {
                string json = JsonConvert.SerializeObject(toSend);
                request.Content = new StringContent(json, Encoding.UTF8, "application/json");
                using (var response = await HttpClient.SendAsync(request))
                {
                    HttpResponse httpResponse = new HttpResponse { ResponseContent = await response.Content.ReadAsStringAsync(), ResponseCode =  response.StatusCode };
                    return httpResponse;
                }
            };

            /*string responseContent;
            using (var request = new HttpRequestMessage(method, uri))
            {
                string json = JsonConvert.SerializeObject(toSend);
                request.Content = new StringContent(json, Encoding.UTF8, "application/json");
                using (var response = await HttpClient.SendAsync(request))
                {
                    if (!response.IsSuccessStatusCode)
                    {
                        var content = await response.Content.ReadAsStringAsync();
                        throw new Exception(response.StatusCode.ToString());
                    }

                    responseContent = await response.Content.ReadAsStringAsync();
                }
            };
            return responseContent;*/
        }

        public string GetEnvironmentBaseUri(EnvironmentEnum environment, EndpointEnum endpoint)
        {
            switch (endpoint)
            {
                case EndpointEnum.Abon:
                    return AbonConfiguration.BaseUrl;
                case EndpointEnum.M2:
                    return environment == EnvironmentEnum.Staging ? AircashConfiguration.M2StagingBaseUrl : AircashConfiguration.M2DevBaseUrl;
                case EndpointEnum.M3:
                    return environment == EnvironmentEnum.Staging ? AircashConfiguration.M3StagingBaseUrl : AircashConfiguration.M3DevBaseUrl;
                case EndpointEnum.Frame:
                    return AircashConfiguration.AircashFrameTestUrl;
                case EndpointEnum.FrameV2:
                    return AircashConfiguration.AircashFrameBaseUrl;
                case EndpointEnum.SalesV2:
                    return AircashConfiguration.AircashSalesBaseUrl;
                default:
                    return string.Empty;
            }
                    
        }

    }
}
