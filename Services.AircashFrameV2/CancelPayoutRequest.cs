using AircashSignature;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashFrameV2
{
    public class CancelPayoutRequest : ISignature
    {
        public string PartnerId { get; set; }
        public string PartnerTransactionId { get; set; }
        public string Signature { get; set; }
    }
}
