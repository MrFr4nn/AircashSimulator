using Domain.Entities.Enum;

namespace AircashSimulator
{
    public class ConfirmTransactionV2Request
    {
        public string CouponCode { get; set; }
        public string PartnerId { get; set; }
        public string PartnerTransactionId { get; set; }
        public string UserId { get; set; }
        public EnvironmentEnum Environment { get; set; }
        public string PhoneNumber { get; set; }

    } 
}
