using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AircashSignature;

namespace Services.AircashPayout
{
    class CheckUserRequest : ISignature
    {
        public string PartnerId { get; set; }
        public string PhoneNumber { get; set; }
        public string PartnerUserId { get; set; }
        public string Signature { get; set; }
    }
}
