using System;

namespace Services.AircashPay
{
    public class GeneratePartnerCodeDTO
    {
        public Guid PartnerId { get; set; }
        public decimal Amount { get; set; }
        public string Description { get; set; }
        public string LocationId { get; set; }
        public Guid UserId { get; set; }
    }
}
