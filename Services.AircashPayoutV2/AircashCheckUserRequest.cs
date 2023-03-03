using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AircashSignature;

namespace Services.AircashPayoutV2
{
    public class AircashCheckUserRQ : ISignature
    {
        public string PartnerID { get; set; }
        public string PhoneNumber { get; set; }
        public string PartnerUserID { get; set; }
        public string Signature { get; set; }
        public List<Parameters> Parameters { get; set; }
    }
}
