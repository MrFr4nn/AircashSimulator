using System;
using Domain.Entities.Enum;

namespace Services.AbonOnlinePartner
{
    class AbonConfirmTransactionV2Response
    {
        public decimal CouponValue { get; set; }
        public CurrencyEnum ISOCurrency { get; set; }
        public string PartnerTransactionId { get; set; }
        public string SalePartnerId { get; set; }
        public string CouponCode { get; set; }
        public string CouponSerialNumber { get; set; }
    }
}
