using AircashSignature;

namespace Services.AircashFrame
{
    public class AircashTransactionStatusResponse : ISignature
    {
        public int Status { get; set; }
        public decimal Amount { get; set; }
        public int CurrencyId { get; set; }
        public string AircashTransactionId { get; set; }
        public string Signature { get; set; }
    }
}
