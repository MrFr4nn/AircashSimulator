using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AircashSimulator
{
    public class CancelCouponRequest
    {
        public string SerialNumber { get; set; }
        public string PointOfSaleId { get; set; }
    }
}
