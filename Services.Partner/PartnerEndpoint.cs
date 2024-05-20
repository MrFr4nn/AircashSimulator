using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Partner
{
    public class PartnerEndpoint
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public string Request { get; set; }
        public string Response { get; set; }

        public PartnerEndpoint(int id,string url, string request, string response) 
        {
            Id = id;
            Url = url;
            Request = request;
            Response = response;        
        }
    }
}
