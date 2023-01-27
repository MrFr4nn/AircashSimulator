using AircashSignature;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashInAppPay
{
    public class GenerateTransactionApiRequest : ISignature
    {
        public Guid PartnerID { get; set; }
        public decimal Amount { get; set; }
        public string Description { get; set; }
        public int CurrencyID { get; set; }
        public string PartnerTransactionID { get; set; }
        public DateTime ValidUntilUTC { get; set; }
        public string SuccessURL { get; set; }
        public string ConfirmURL { get; set; }
        public string DeclineURL { get; set; }
        public string Signature { get; set; }

    }
}
