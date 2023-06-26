using System;
using Domain.Entities.Enum;

namespace Domain.Entities
{
    public class PreparedAircashFrameTransactionEntity
    {
        public int Id { get; set; }
        public string PartnerTransactionId { get; set; }
        public Guid PartnerId { get; set; }
        public string UserId { get; set; }
        public decimal Amount { get; set; }
        public CurrencyEnum ISOCurrencyId { get; set; }
        public PayTypeEnum PayType { get; set; }
        public PayMethodEnum PayMethod { get; set; }
        public string NotificationUrl { get; set; }
        public string SuccessUrl { get; set; }
        public string DeclineUrl { get; set; }
        public  DateTime? RequestDateTimeUTC { get; set; }
        public DateTime? ResponseDateTimeUTC { get; set; }
        public AcFramePreparedTransactionStatusEnum TransactionSatus { get; set; }
    }
}
