using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashPayoutV2
{
    public class ConfirmTransactionResponse
    {
        public string BarCode { get; set; }
        public decimal Amount { get; set; }
        public string AircashTransactionID { get; set; }
    }
}
