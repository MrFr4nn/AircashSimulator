using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AircashSimulator.Controllers.AircashPaymentAndPayout
{
    public class CancelTransactionRequest
    {
        public string PartnerId { get; set; }
        public string PartnerTransactionID { get; set; }
        public string LocationID { get; set; }
    }
}
