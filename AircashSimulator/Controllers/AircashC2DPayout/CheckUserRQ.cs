using Services.AircashPayoutV2;
using System;
using System.Collections.Generic;

namespace AircashSimulator.Controllers.AircashC2DPayout
{
    public class CheckUserRQ
    {
        public Guid PartnerId { get; set; }
        public string PhoneNumber { get; set; }
        public List<Parameters> Parameters { get; set; }
    }
}
