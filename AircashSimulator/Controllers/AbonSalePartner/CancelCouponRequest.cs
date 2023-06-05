using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AircashSimulator
{
    public class CancelCouponRequest
    {
        public string PartnerId { get; set; }
        public string SerialNumber { get; set; }
        public string PartnerTransactionId { get; set; }
        public string PointOfSaleId { get; set; }
    }
}
