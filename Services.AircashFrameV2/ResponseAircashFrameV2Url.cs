using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashFrameV2
{
    public class ResponseAircashFrameV2Url
    {
        public object ServiceRequest { get; set; }
        public object ServiceResponse { get; set; }
        public string Sequence { get; set; }
        public DateTime RequestDateTimeUTC { get; set; }
        public DateTime ResponseDateTimeUTC { get; set; }
        public string AcFrameUrl { get; set; }
    }
}
