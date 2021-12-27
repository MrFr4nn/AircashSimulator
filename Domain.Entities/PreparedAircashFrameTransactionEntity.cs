using Domain.Entities.Enum;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities
{
    public class PreparedAircashFrameTransactionEntity
    {
        public int Id { get; set; }
        public Guid PartnerTransactionId { get; set; }
        public Guid PartnerId { get; set; }
        public Guid UserId { get; set; }
        public decimal Amount { get; set; }
        public CurrencyEnum ISOCurrencyId { get; set; }
        public int PayType { get; set; }
        public int PayMethod { get; set; }
        public string NotificationUrl { get; set; }
        public string SuccessUrl { get; set; }
        public string DeclineUrl { get; set; }
        public  DateTime? RequestDateTimeUTC { get; set; }
        public DateTime? ResponseDateTimeUTC { get; set; }
    }
}
