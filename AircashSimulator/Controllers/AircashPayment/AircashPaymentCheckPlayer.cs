using AircashSignature;
using System.Collections.Generic;

namespace AircashSimulator.Controllers.AircashPayment
{
    public class AircashPaymentCheckPlayer : ISignature
    {
         public List<Parameters> Parameters { get; set; }
         public string Signature { get; set; }

    }
}
