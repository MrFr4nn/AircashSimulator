using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Services.HttpRequest
{
    public class HttpResponse
    {
        public string ResponseContent { get; set; }
        public HttpStatusCode ResponseCode { get; set; }
    }
}
