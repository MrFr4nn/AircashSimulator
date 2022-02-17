using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Services.HttpRequest
{
    public class HttpRequestService : IHttpRequestService
    {

        private readonly HttpClient HttpClient;
        public HttpRequestService(HttpClient httpClient)
        {
            HttpClient = httpClient;
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
    }
}
