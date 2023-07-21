using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashPayment
{
    public class CreateAndConfirmPaymentReceive
    {
        public string AircashTransactionId { get; set; }
        public decimal Amount { get; set; }
        public List<AircashPaymentParameters> Parameters { get; set; }

    }
}
