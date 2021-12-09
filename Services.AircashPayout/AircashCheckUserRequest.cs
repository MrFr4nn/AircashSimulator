using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AircashSignature;

namespace Services.AircashPayout
{
    class AircashCheckUserRequest : ISignature
    {
        public string PartnerID { get; set; }
        public string PhoneNumber { get; set; }
        public string PartnerUserID { get; set; }
        public string Signature { get; set; }
    }
}
