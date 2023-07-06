using Domain.Entities.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Transactions
{
    public class PreparedAircashPayTransaction
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
