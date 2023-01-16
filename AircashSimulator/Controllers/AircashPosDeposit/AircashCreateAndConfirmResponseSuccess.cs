using Services.AircashPosDeposit;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace AircashSimulator.Controllers.AircashPosDeposit
{
    public class AircashCreateAndConfirmResponseSuccess
    {
        public bool Success { get; set; }
        public string PartnerTransactionId { get; set; }
        public List<CheckPlayerParameter> Parameters { get; set; }
    }
}
