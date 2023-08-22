using Domain.Entities.Enum;

namespace Services.AbonOnlinePartner
{
    class AbonCheckStatusCouponResponse
    {
        public decimal CouponValue { get; set; }
        public bool IsValid { get; set; }
        public CurrencyEnum ISOCurrency { get; set; }
        public string IsoCountryCode { get; set; }
        public decimal OriginalCouponValue { get; set; }
        public CurrencyEnum OriginalISOCurrency { get; set; }
        public decimal CurrentCouponValue { get; set; }
        public string AircashUserId { get; set; }
    }
}
