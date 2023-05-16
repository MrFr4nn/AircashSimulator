using System;

namespace AircashSimulator
{
    public class CreateCashierCouponRequest
    {

            public decimal Value { get; set; }
            public string PointOfSaleId { get; set; }
            public string PartnerId { get; set; }
    }
}
