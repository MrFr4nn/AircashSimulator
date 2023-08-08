using AircashSignature;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashFrameV2
{
    public class AircashRefundTransactionRequestV2 : ISignature
    {
        public Guid PartnerId { get; set; }
        public string PartnerTransactionId { get; set; }
        public string RefundPartnerTransactionID { get; set; }
        public decimal Amount { get; set; }
        public string Signature { get; set; }
    }
}
