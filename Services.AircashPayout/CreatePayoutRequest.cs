using AircashSignature;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashPayout
{
    public class CreatePayoutRequest: ISignature
    {
        public string PartnerID { get; set; }
        public string PartnerTransactionID { get; set; }
        public decimal Amount { get; set; }
        public string PhoneNumber { get; set; }
        public string PartnerUserID { get; set; }
        public int CurrencyID { get; set; }
        public string Signature { get; set; }
    }
}
