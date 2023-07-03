using System.Collections.Generic;

namespace Services.AircashPosDeposit
{
    public class AircashCreatePayoutRS
    {
        public string AircashTransactionID { get; set; }
        public List<Parameter> Parameters { get; set; }
    }
}
