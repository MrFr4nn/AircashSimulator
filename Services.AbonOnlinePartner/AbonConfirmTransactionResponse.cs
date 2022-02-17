using System;
using Domain.Entities.Enum;

namespace Services.AbonOnlinePartner
{
    class AbonConfirmTransactionResponse
    {
        public decimal CouponValue { get; set; }
        public CurrencyEnum ISOCurrency { get; set; }
        public Guid ProviderTransactionId { get; set; }
    }
}
