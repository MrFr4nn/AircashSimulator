using System;
using AircashSignature;

namespace Services.AbonOnlinePartner
{
    public class AbonValidateCouponRequest : ISignature
    {
        public string CouponCode { get; set; }
        public Guid ProviderId { get; set; }
        public string Signature { get; set; }
    }
}
