using AircashSignature;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Resources
{
    public class CreateCouponRequest: ISignature
    {
        public string PartnerId { get; set; }
        public decimal Value { get; set; }
        public string PointOfSaleId { get; set; }
        public string ISOCurrencySymbol { get; set; }
        public string PartnerTransactionId { get; set; }
        public string ContentType { get; set; }
        public int? ContentWidth { get; set; }
        public string Signature { get; set; }
    }
}
