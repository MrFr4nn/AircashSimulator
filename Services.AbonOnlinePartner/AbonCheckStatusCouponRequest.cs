using System;
using System.Collections.Generic;
using AircashSignature;

namespace Services.AbonOnlinePartner
{
    public class AbonCheckStatusCouponRequest : ISignature
    {
        public string PartnerId { get; set; }
        public string CouponCode { get; set; }
        public string PartnerTransactionId { get; set; }
        public string NotificationUrl { get; set; }
        public string UserId { get; set; }
        public string PhoneNumber { get; set; }
        public List<AbonCheckStatusCouponParameters> Parameters { get; set; }
        public string Signature { get; set; }
    }
}
