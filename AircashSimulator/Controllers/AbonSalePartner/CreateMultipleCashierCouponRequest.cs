using System.Collections.Generic;

namespace AircashSimulator.Controllers.AbonSalePartner
{
    public class CreateMultipleCashierCouponRequest
    {
        public List<decimal> Values { get; set; }
        public string PointOfSaleId { get; set; }
        public string PartnerId { get; set; }
        public string CurrencyISOCode { get; set; }
    }
}
