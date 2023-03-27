using AircashSignature;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashInAppPay
{
    public class RefundTransactionApiRQ : ISignature
    {
        public string PartnerID { get; set; }
        public string PartnerTransactionID { get; set; }
        public string RefundTransactionID { get; set; }
        public decimal Amount { get; set; }
        public string Signature { get; set; }
    }
}
