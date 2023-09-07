using System;

namespace AircashSimulator.Controllers.CobrandedCard
{
    public class UpdateCardOrderStatusDTO
    {
        public Guid CardID { get; set; }
        public bool NewUser { get; set; }
    }
}
