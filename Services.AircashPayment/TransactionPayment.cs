using Domain.Entities.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashPayment
{
    public class TransactionPayment
    {
        public decimal Amount { get; set; }
        public CurrencyEnum ISOCurrencyId { get; set; }
        public Guid PartnerId { get; set; }
        public string AircashTransactionId { get; set; }
        public Guid PartnerTransactionId { get; set; }
        public Guid TransactionId { get; set; }
    }
}
