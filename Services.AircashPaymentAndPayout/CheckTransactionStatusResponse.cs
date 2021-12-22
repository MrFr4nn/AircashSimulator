using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashPaymentAndPayout
{
     public class CheckTransactionStatusResponse
    {
        public decimal Amount { get; set; }
        public string AircashTransactionID { get; set; }
        public string LocationID { get; set; }
    }
}
