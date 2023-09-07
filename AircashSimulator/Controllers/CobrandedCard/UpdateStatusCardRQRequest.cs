using System;

namespace AircashSimulator.Controllers.CobrandedCard
{
    public class UpdateStatusCardRQRequest
    {
        public Guid PartnerID { get; set; }
        public string PartnerCardID { get; set; }
        public int OldStatus { get; set; }
        public int NewStatus { get; set; }
        public int? DenialStatusDetails { get; set; }
    }
}
