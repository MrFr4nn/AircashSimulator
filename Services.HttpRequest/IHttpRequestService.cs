using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace Services.HttpRequest
{
    public interface IHttpRequestService
    {
        Task<HttpResponse> SendRequestAircash(object toSend, HttpMethod method, string uri);
    }
}
