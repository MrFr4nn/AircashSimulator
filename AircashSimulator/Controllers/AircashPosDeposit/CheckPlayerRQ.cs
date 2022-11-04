using AircashSignature;
using System.Collections.Generic;

namespace AircashSimulator.Controllers.AircashPosDeposit
{
    public class CheckPlayerRQ : ISignature
    {
        public List<Parameters> Parameters { get; set; }
        public string Signature { get; set; }
    }
    public class Parameters
    {
        public string Key { get; set; }
        public string Value { get; set; }
    }
}
