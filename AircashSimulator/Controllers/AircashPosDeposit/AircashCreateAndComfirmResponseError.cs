using Services.AircashPosDeposit;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace AircashSimulator.Controllers.AircashPosDeposit
{
    public class AircashCreateAndComfirmResponseError
    {
        public bool Success { get; set; }
        public ResponseError Error { get; set; }
        public List<CheckPlayeParameter> Parameters { get; set; }
    }
}
