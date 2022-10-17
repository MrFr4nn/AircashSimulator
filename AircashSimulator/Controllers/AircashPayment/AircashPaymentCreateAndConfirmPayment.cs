using AircashSignature;
using System.Collections.Generic;

namespace AircashSimulator.Controllers.AircashPayment
{
    public class AircashPaymentCreateAndConfirmPayment : ISignature
    {
        public string TransactionId { get; set; }

        public decimal Amount { get; set; }

        public List<Parameter> Parameters { get; set; }

        public string Signature { get; set; }
    }

    public class Parameter
    {
        string Key { get; set; }
        string Value { get; set; }
    }
}
