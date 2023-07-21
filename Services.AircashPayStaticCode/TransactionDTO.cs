using System;
using Domain.Entities.Enum;

namespace Services.AircashPayStaticCode
{
    public class TransactionDTO
    {
        public decimal Amount { get; set; }
        public CurrencyEnum ISOCurrencyId { get; set; }
        public Guid PartnerId { get; set; }
        public string AircashTransactionId { get; set; }
        public string PartnerTransactionId { get; set; }
        public string UserId { get; set; }
    }
}
