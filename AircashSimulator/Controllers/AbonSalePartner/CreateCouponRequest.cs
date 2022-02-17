using AircashSignature;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AircashSimulator
{
    public class CreateCouponRequest
    {
        public decimal Value { get; set; }
        public string PointOfSaleId { get; set; }
    }
}
