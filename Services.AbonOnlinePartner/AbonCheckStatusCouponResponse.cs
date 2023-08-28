using Domain.Entities.Enum;

namespace Services.AbonOnlinePartner
{
    class AbonCheckStatusCouponResponse
    {
        public decimal CouponValue { get; set; }
        public int Status { get; set; }
        public string ISOCurrency { get; set; }             
        public string OriginalISOCurrency { get; set; }
        public decimal OriginalCouponValue { get; set; }
        public decimal CurrentCouponValue { get; set; }
        public string AircashUserId { get; set; }
    }
}
