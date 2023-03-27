
using System;

namespace Services.AbonOnlinePartner
{
    public class ErrorResponse
    {
        public int Code { get; set; }
        public string Message { get; set; }
        public Data AdditionalData { get; set; }
    }

    public class Data
    {
        public decimal CouponValue { get; set; }
        public string ISOCurrency { get; set; }
        public Guid ProviderTransactionId { get; set; }
    }
}
