﻿using System;
using Domain.Entities.Enum;

namespace Services.Transactions
{
    public class Transaction
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public CurrencyEnum ISOCurrencyId { get; set; } 
        public Guid PartnerId { get; set; }
        public string AircashTransactionId { get; set; }
        public string TransactionId { get; set; }
        public DateTime? RequestDateTimeUTC { get; set; }
        public DateTime? ResponseDateTimeUTC { get; set; }
        public ServiceEnum ServiceId { get; set; }
        public string UserId { get; set; }
        public string PointOfSaleId { get; set; }
    }
}
