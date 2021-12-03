using Domain.Entities.Enum;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities
{
    public class PreparedAircashTransactionEntity
    {
        public int Id { get; set; }
        public Guid PartnerId { get; set; }
        public decimal Amount { get; set; }
        public CurrencyEnum ISOCurrencyId { get; set; }
        public Guid PartnerTransactionId { get; set; }
        public string Description { get; set; }
        public int? ValidForPeriod { get; set; }
        public string LocationId { get; set; }
    }
}
