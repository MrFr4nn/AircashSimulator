using Services.AbonOnlinePartner;
using System.Collections.Generic;

namespace AircashSimulator
{
    public class CheckStatusCouponRequest
    {
        public string PartnerId { get; set; }
        public string CouponCode { get; set; }
        public string PartnerTransactionId { get; set; }
        public string NotificationUrl { get; set; }
        public string UserId { get; set; }
        public string UserPhoneNumber { get; set; }
        public List<AbonCheckStatusCouponParameters> Parameters { get; set; }
    }
}
