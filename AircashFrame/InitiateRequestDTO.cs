using System;

namespace Services.AircashFrame
{
    public class InitiateRequestDTO
    {
        public Guid PartnerId { get; set; }
        public Guid UserId { get; set; }
        public decimal Amount { get; set; }
        public int Currency { get; set; }
        public int PayType { get; set; }
        public int PayMethod { get; set; }
    }
}
