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
        public string PartnerId { get; set; }
        public string PartnerTransactionId { get; set; }
        public string IsoCurrencySymbol { get; set; }
        public string ContentType { get; set; }
        public int? ContentWidth { get; set; }
    }
}
