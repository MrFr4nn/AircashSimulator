﻿using System;

namespace Services.AircashPay
{
    public class RefundTransactionDTO
    {
        public Guid PartnerId { get; set; }
        public Guid PartnerTransactionId { get; set; }
        public Guid RefundPartnerTransactionId { get; set; }

        public decimal Amount { get; set; }
    }
}
