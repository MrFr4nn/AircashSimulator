using Services.AircashPosDeposit;
using System;
using System.Collections.Generic;

namespace AircashSimulator.Controllers.AircashPosDeposit
{
    public class CheckUserRQ
    {
        public Guid PartnerId { get; set; }
        public string PhoneNumber { get; set; }
        public List<Parameter> Parameters { get; set; }
    }
}
