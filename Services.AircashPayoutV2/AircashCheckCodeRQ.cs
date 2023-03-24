using AircashSignature;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashPayoutV2
{
    public class AircashCheckCodeRQ : ISignature
    {
        public string PartnerID { get; set; }
        public string BarCode { get; set; }
        public string LocationID { get; set; }
        public string Signature { get; set; }
    }
}
