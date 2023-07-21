using System;
using Domain.Entities.Enum;

namespace Services.AbonOnlinePartner
{
    class AbonConfirmTransactionResponse
    {
        public decimal CouponValue { get; set; }
        public CurrencyEnum ISOCurrency { get; set; }
        public string ProviderTransactionId { get; set; }
        public string SalePartnerId { get; set; }
        public string IsoCountryCode { get; set; }
    }
}
