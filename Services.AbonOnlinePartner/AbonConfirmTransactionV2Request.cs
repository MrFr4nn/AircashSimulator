using System;
using AircashSignature;

namespace Services.AbonOnlinePartner
{
    public class AbonConfirmTransactionV2Request : ISignature
    {
        public string CouponCode { get; set; }
        public string PartnerId { get; set; }
        public string PartnerTransactionId { get; set; }
        public string UserId { get; set; }
        public string Signature { get; set; }
    }
}
