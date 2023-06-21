using System;
using AircashSignature;

namespace Services.AbonOnlinePartner
{
    public class AbonConfirmTransactionRequest : ISignature
    {
        public string CouponCode { get; set; }
        public string ProviderId { get; set; }
        public string ProviderTransactionId { get; set; }
        public string UserId { get; set; }
        public string Signature { get; set; }
    }
}
