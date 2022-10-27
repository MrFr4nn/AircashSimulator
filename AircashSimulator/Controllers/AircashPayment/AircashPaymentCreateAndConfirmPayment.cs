using AircashSignature;
using System.Collections.Generic;

namespace AircashSimulator.Controllers.AircashPayment
{
    public class AircashPaymentCreateAndConfirmPayment : ISignature
    {
        public string TransactionID { get; set; }
        public decimal Amount { get; set; }
        public List<Parameters> Parameters { get; set; 
        public string Signature { get; set; }
    }

}
