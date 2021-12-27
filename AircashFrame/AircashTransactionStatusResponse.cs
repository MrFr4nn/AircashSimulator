using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashFrame
{
    public class AircashTransactionStatusResponse
    {
        public int Status { get; set; }
        public decimal Amount { get; set; }
        public int Currency { get; set; }
        public string AircashTransactionId { get; set; }
        public string Signature { get; set; }
    }
}
