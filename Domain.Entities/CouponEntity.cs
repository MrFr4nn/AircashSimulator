using System;
using Domain.Entities.Enum;

namespace Domain.Entities
{
    public class CouponEntity
    {
        public int ID { get; set; }
        public string SerialNumber { get; set; } //max16, not null, +
        public int PurchasedPartnerID { get; set; } //int, not null, +
        public decimal PurchasedAmount { get; set; } //dec(18,2), not null+
        public CurrencyEnum PurchasedCurrency { get; set; } //not null+
        public string PurchasedCountryIsoCode { get; set; } //max(2), not null+
        public DateTime PurchasedOnUTC { get; set; } //datetime2, not null+
        public int? UsedOnPartnerID { get; set; } //null
        public decimal? UsedAmount { get; set; }//nul, decimal(18,2)
        public CurrencyEnum? UsedCurrency { get; set; }//null
        public string UsedCountryIsoCode { get; set; }//null, nvarchar(2)
        public DateTime? UsedOnUTC { get; set; }//datetime2, null
        public string UserId { get; set; }//null
        public DateTime? CancelledOnUTC { get; set; }//datetime2, null
        public string Content { get; set; } //not null, varchar
        public string CouponCode { get; set; }

        public PartnerEntity PurchasedPartner { get; set; }
        public PartnerEntity UsedOnPartner { get; set; }
    }
}
