using System;
using System.Collections.Generic;
using System.Text;

namespace Services.AbonSalePartner
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