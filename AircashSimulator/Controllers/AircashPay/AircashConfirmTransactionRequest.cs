using AircashSignature;

namespace Services.AircashPay
{
    public class AircashConfirmTransactionRequest : ISignature
    {
        public string PartnerID { get; set; }
        public string PartnerTransactionID { get; set; }
        public decimal Amount { get; set; }
        public int CurrencyID { get; set; }
        public string AircashTransactionID { get; set; }
        public string Signature { get; set; }
    }
}
