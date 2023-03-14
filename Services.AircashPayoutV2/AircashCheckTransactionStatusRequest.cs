using AircashSignature;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashPayoutV2
{
    public class AircashCheckTransactionStatusRequest:ISignature
    {
        public string PartnerID { get; set; }
        public string PartnerTransactionID { get; set; }
        public string AircashTransactionID { get; set; }
        public string Signature { get; set; }
    }
}
