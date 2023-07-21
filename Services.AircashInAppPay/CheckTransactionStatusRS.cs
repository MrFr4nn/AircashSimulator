using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashInAppPay
{
    public class CheckTransactionStatusRS
    {
        public decimal Amount { get; set; }
        public int CurrencyID { get; set; }
        public string AircashTransactionID { get; set; }
        public object User { get; set; }
        public string Signature { get; set; }
    }
}
