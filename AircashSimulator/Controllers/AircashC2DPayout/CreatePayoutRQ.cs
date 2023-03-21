using System.Collections.Generic;
using Services.AircashPayoutV2;

namespace AircashSimulator.Controllers.AircashC2DPayout
{
    public class CreatePayoutRQ
    {
        public decimal Amount { get; set; }
        public string PhoneNumber { get; set; }
        public List<Parameters> Parameters { get; set; }
    }
}
