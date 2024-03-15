using AircashSignature;
using System.Collections.Generic;
using System;

namespace Services.AbonSalePartner
{
    public class MultipleCouponABONRequest : ISignature
    {
        public Guid PartnerId { get; set; }
        public string PointOfSaleId { get; set; }
        public string ISOCurrencySymbol { get; set; }
        public string ContentType { get; set; }
        public int? ContentWidth { get; set; }
        public List<AbonDenomination> Denominations { get; set; }
        public string Signature { get; set; }
    }

    public class AbonDenomination
    {
        public decimal Value { get; set; }
        public string PartnerTransactionId { get; set; }
    }
}
