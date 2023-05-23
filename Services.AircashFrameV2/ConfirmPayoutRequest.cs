using AircashSignature;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashFrameV2
{
    public class ConfirmPayoutRequest: ISignature
    {
        public string PartnerId {  get; set; }
        public string PartnerTransactionId {  get; set; }
        public decimal Amount {  get; set; }
        public int CurrencyId {  get; set; }
        public string Signature {  get; set; }
    }
}
