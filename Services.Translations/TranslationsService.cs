using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Services.Translations
{
    public class TranslationsService : ITranslationsService
    {
        public class HttpResponse
        {
            public string ResponseContent { get; set; }
            public HttpStatusCode ResponseCode { get; set; }
        }
        public async Task<object> GetTranslations(string locale)
        {
            var baseUri = new Uri("https://localise.biz/api/export/");
            var key = "Rn2QOUghczbjJ8fRrcWltmVSfrMw6y9A";
            var endpoint = new Uri(baseUri, $"locale/{locale}.json?key={key}");
            using (var client = new HttpClient())
            {
                HttpResponseMessage response = await client.GetAsync(endpoint);
                HttpResponse httpResponse = new HttpResponse { ResponseContent = await response.Content.ReadAsStringAsync(), ResponseCode = response.StatusCode };
                return httpResponse;
            }
        }
    }
}
