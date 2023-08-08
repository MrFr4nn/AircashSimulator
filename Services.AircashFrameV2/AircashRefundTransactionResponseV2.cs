using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashFrameV2
{
    public class AircashRefundTransactionResponseV2
    {
        public string TransactionID { get; set; }
        public string PartnerTransactionID { get; set; }
        public string RefundPartnerTransactionID { get; set; }

    }
}
