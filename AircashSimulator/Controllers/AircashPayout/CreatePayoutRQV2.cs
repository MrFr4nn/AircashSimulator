using System.Collections.Generic;
using Services.AircashPayoutV2;

namespace AircashSimulator.Controllers.AircashPayout
{
    public class CreatePayoutRQV2
    {
        public decimal Amount { get; set; }
        public string PhoneNumber { get; set; }
        public List<Parameters> Parameters { get; set; }
    }
}
