using AircashSignature;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashPayout
{
    public class AircashCheckUserV4Request: ISignature
    {
        public string PartnerID { get; set; }
        public string PhoneNumber { get; set; }
        public string PartnerUserID { get; set; }
        public List<Parameter> Parameters { get; set; }
        public string Signature { get; set; }
    }
}
