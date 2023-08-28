using Domain.Entities.Enum;

namespace Services.AbonOnlinePartner
{
    class AbonValidateCouponResponse
    {
        public decimal CouponValue { get; set; }
        public bool IsValid { get; set; }
        public string ISOCurrency { get; set; }
        public string ProviderTransactionId { get; set; }
        public string SalePartnerId { get; set; }
        public string IsoCountryCode { get; set; }
        public decimal OriginalCouponValue { get; set; }
        public string OriginalISOCurrency { get; set; }
    }
}
