using AircashSignature;
using Domain.Entities.Enum;

namespace Services.AircashFrame
{
    public class AircashTransactionStatusResponse : ISignature
    {
        public AcFrameTransactionStatusEnum Status { get; set; }
        public decimal Amount { get; set; }
        public int CurrencyId { get; set; }
        public string AircashTransactionId { get; set; }
        public string Signature { get; set; }
    }
}
