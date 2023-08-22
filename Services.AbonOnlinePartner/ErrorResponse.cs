
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
        public string PartnerTransactionId { get; set; }
    }

    public class ErrorResponseV2
    {
        public int Code { get; set; }
        public string Message { get; set; }
        public DataV2 AdditionalData { get; set; }
    }

    public class DataV2
    {
        public decimal CouponValue { get; set; }
        public string ISOCurrency { get; set; }
        public string PartnerTransactionId { get; set; }
    }
}
