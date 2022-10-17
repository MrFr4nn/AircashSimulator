using System;
using Domain.Entities.Enum;

namespace Services.AircashStaticCodePay
{
    public class TransactionDTO
    {
        public decimal Amount { get; set; }
        public CurrencyEnum ISOCurrencyId { get; set; }
        public Guid PartnerId { get; set; }
        public string AircashTransactionId { get; set; }
        public Guid PartnerTransactionId { get; set; }
        public Guid UserId { get; set; }
    }
}
