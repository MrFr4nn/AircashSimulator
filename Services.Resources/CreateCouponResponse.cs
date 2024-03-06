using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Resources
{
    public class CreateCouponResponse
    {
        public string SerialNumber { get; set; }
        public string CouponCode { get; set; }
        public decimal Value { get; set; }
        public string IsoCurrencySymbol { get; set; }
        public string Content { get; set; }
        public string PartnerTransactionId { get; set; }
    }
}
