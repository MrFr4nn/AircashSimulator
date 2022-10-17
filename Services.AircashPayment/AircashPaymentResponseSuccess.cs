using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashPayment
{
    public class AircashPaymentResponseSuccess
    {
        public bool Success { get; set; }
        public string PartnerTransactionID { get; set; }
        List<Parameters> Parameters { get; set; }
    }
}
