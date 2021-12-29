using System;
using Domain.Entities.Enum;

namespace Domain.Entities
{
    public class TransactionEntity
    {
        public int Id { get; set; }
        public decimal Amount { get; set; } 
        public CurrencyEnum ISOCurrencyId { get; set; }
        //public string CouponCode { get; set; } 
        public Guid PartnerId { get; set; } 
        public string AircashTransactionId { get; set; }
        public Guid TransactionId { get; set; } 
        public DateTime? RequestDateTimeUTC { get; set; } 
        public DateTime? ResponseDateTimeUTC { get; set; } 
        public ServiceEnum ServiceId { get; set; } 
        public Guid UserId { get; set; } 
        public string PointOfSaleId { get; set; } 


    }
}
