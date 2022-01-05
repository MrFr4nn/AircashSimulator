using Domain.Entities.Enum;

namespace Services.AbonOnlinePartner
{
    class AbonValidateCouponResponse
    {
        public decimal CouponValue { get; set; }
        public bool IsValid { get; set; }
        public CurrencyEnum ISOCurrency { get; set; }
        public string ProviderTransactionId { get; set; }
        public decimal OriginalCouponValue { get; set; }
        public CurrencyEnum OriginalISOCurrency { get; set; }
    }
}
