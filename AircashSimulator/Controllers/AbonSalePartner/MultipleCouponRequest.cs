using System.Collections.Generic;
using System;

namespace AircashSimulator
{
    public class MultipleCouponRequest
    {
        public Guid PartnerId { get; set; }
        public string PointOfSaleId { get; set; }
        public string ISOCurrencySymbol { get; set; }
        public string ContentType { get; set; }
        public int? ContentWidth { get; set; }
        public List<MultipleCouponCreationRequestDenomination> Denominations { get; set; }
    }

    public class MultipleCouponCreationRequestDenomination
    {
        public decimal Value { get; set; }
        public string PartnerTransactionId { get; set; }
    }
}