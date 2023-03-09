using Services.AircashPayoutV2;
using System.Collections.Generic;

namespace AircashSimulator.Controllers.AircashPayout
{
    public class CheckUserRQV2
    {
        public string PhoneNumber { get; set; }
        public List<Parameters> Parameters { get; set; }
    }
}
