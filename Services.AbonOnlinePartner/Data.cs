using System;

namespace Services.AbonOnlinePartner
{
    public class Data
    {
        public decimal CouponValue { get; set; }
        public string ISOCurrency { get; set; }
        public Guid ProviderTransactionId { get; set; }
    }
}
