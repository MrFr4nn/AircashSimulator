﻿
namespace Services.AircashPay
{
    public class AircashRefundTransactionResponse
    {
        public string TransactionId { get; set; }
        public string PartnerTransactionID { get; set; }
        public string RefundPartnerTransactionId { get; set; }
    }
}
