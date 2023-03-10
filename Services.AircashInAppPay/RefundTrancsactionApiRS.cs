using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashInAppPay
{
    public class RefundTrancsactionApiRS
    {
        public string TransactionID { get; set; }
        public string PartnerTransactionID { get; set; }
        public string RefundTransactionID { get; set; }
    }
}
