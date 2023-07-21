using System;

namespace Services.AircashPay
{
    public class GeneratePartnerCodeDTO
    {
        public Guid PartnerId { get; set; }
        public decimal Amount { get; set; }
        public string Description { get; set; }
        public string LocationId { get; set; }
        public string UserId { get; set; }
        public string PartnerTransactionId { get; set; }
        public int CurrencyId { get; set; }
        public int? ValidForPeriod { get; set; }
    }
}
