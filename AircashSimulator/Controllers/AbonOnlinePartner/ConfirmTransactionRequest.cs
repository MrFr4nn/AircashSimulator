﻿
namespace AircashSimulator
{
    public class ConfirmTransactionRequest
    {
        public string CouponCode { get; set; }
        public string ProviderId { get; set; }
        public string ProviderTransactionId { get; set; }
        public string UserId { get; set; }
    }
}
