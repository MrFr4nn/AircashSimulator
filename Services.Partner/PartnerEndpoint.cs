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
        public int EndpointType { get; set; }
        public string EndpointTypeName { get; set; }
        public int EndpointId { get; set; }
    }
}
