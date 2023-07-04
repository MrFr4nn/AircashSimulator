using AircashSignature;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashPayment
{
    public class CreateAndConfirmPartnerRQ: ISignature
    {
        public string TransactionID { get; set; }
        public decimal Amount { get; set; }
        public List<AircashPaymentParameters> Parameters { get; set; }

        public string Signature { get; set; }
    }
}
