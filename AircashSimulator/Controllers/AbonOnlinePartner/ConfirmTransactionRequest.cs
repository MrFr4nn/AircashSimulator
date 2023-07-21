
using Domain.Entities.Enum;

namespace AircashSimulator
{
    public class ConfirmTransactionRequest
    {
        public string CouponCode { get; set; }
        public string ProviderId { get; set; }
        public string ProviderTransactionId { get; set; }
        public string UserId { get; set; }
        public EnvironmentEnum Environment { get; set; }
        public string PhoneNumber { get; set; }
    }
}
