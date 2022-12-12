using AircashSignature;
using System.Collections.Generic;

namespace AircashSimulator.Controllers.AircashPosDeposit
{
    public class AircashPosDepositCreateAndConfirmPayment : ISignature
    {
        public string TransactionID { get; set; }
        public decimal Amount { get; set; }
        public List<Parameter> Parameters { get; set; }
        public string Signature { get; set; }
    }
}
