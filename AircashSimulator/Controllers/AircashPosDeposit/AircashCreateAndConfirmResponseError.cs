using Services.AircashPosDeposit;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace AircashSimulator.Controllers.AircashPosDeposit
{
    public class AircashCreateAndConfirmResponseError
    {
        public bool Success { get; set; }
        public ResponseError Error { get; set; }
        public List<CheckPlayerParameter> Parameters { get; set; }
    }
}
