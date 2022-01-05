using AircashSignature;

namespace Services.AircashFrame
{
    public class AircashInitiateRequest : ISignature
    {
        public string PartnerId { get; set; }
        public string PartnerUserId { get; set; }
        public string PartnerTransactionId { get; set; }
        public string Amount { get; set; }
        public int CurrencyId { get; set; }
        public int PayType { get; set; }
        public int PayMethod { get; set; }
        public string NotificationUrl { get; set; }
        public string SuccessUrl { get; set; }
        public string DeclineUrl { get; set; }
        public string Locale { get; set; }
        public string Signature { get; set; }
    }
}
