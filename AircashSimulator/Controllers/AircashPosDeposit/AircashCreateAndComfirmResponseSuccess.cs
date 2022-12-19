using Services.AircashPosDeposit;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace AircashSimulator.Controllers.AircashPosDeposit
{
    public class AircashCreateAndComfirmResponseSuccess
    {
        public bool Success { get; set; }
        public string PartnerTransactionId { get; set; }
        public List<CheckPlayeParameter> Parameters { get; set; }
    }
}
