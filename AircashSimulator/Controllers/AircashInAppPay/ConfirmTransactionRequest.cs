using System;

namespace AircashSimulator.Controllers.AircashInAppPay
{
    public class ConfirmTransactionRequest
    {
        public decimal Amount { get; set; }
        public int CurrencyID  { get; set; }
        public string AircashTransactionID { get; set; }
        public string PartnerTransactionID { get; set; }


    }
}
