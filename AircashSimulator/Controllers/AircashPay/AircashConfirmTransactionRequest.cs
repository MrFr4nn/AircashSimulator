using AircashSignature;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashPay
{
    public class AircashConfirmTransactionRequest : ISignature
    {
        public string PartnerId { get; set; }
        public string PartnerTransactionId { get; set; }
        public decimal Amount { get; set; }
        public int CurrencyId { get; set; }
        public string AircashTransactionId { get; set; }
        public string Signature { get; set; }
    }
}
