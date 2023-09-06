using System;

namespace AircashSimulator.Controllers.CobrandedCard
{
    public class UpdateStatusCardRQRequest
    {
        public Guid PartnerID { get; set; }
        public string PartnerCardID { get; set; }
    }
}
