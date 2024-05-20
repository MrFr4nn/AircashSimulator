using Domain.Entities.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Partner
{
    public class Endpoint
    {
        public int Id { get; set; }
        public string EndpointType { get; set; }
        public string Url { get; set; }
    }

    public class EndpointInfo
    {
        public EndpointTypeEnum  EndpointType { get; set; }
        public string Url { get; set; }
    }
}
