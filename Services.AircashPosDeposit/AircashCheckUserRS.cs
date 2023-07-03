using System.Collections.Generic;

namespace Services.AircashPosDeposit
{
    public class AircashCheckUserRS
    {
        public int Status { get; set; }
        public List<Parameter> Parameters { get; set; }
    }
}
