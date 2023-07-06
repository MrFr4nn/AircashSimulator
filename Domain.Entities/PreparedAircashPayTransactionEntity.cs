using System;
using Domain.Entities.Enum;

namespace Domain.Entities
{
    public class PreparedAircashPayTransactionEntity
    {
        public int Id { get; set; }
        public Guid PartnerId { get; set; }
        public decimal Amount { get; set; }
        public CurrencyEnum ISOCurrencyId { get; set; }
        public string PartnerTransactionId { get; set; }
        public string Description { get; set; }
        public int? ValidForPeriod { get; set; }
        public string LocationId { get; set; }
        public string UserId { get; set; }
        public AcPayTransactionSatusEnum Status { get; set; }
        public DateTime? RequestDateTimeUTC { get; set; }
        public DateTime? ResponseDateTimeUTC { get; set; }
    }
}
