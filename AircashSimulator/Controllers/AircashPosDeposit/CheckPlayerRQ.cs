using AircashSignature;
using System.Collections.Generic;

namespace AircashSimulator.Controllers.AircashPosDeposit
{
    public class CheckPlayerRQ : ISignature
    {
        public List<Parameter> Parameters { get; set; }
        public string Signature { get; set; }
    }
}
