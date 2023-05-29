
using Domain.Entities.Enum;

namespace AircashSimulator
{
    public class ConfirmTransactionRequest
    {
        public string CouponCode { get; set; }
        public EnvironmentEnum Environment { get; set; }
    }
}
