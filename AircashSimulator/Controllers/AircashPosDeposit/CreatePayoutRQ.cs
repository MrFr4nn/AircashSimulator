using Services.AircashPosDeposit;
using System;
using System.Collections.Generic;

namespace AircashSimulator.Controllers.AircashPosDeposit
{
    public class CreatePayoutRQ
    {
        public Guid PartnerId { get; set; }
        public decimal Amount { get; set; }
        public string PhoneNumber { get; set; }
        public List<Services.AircashPosDeposit.Parameter> Parameters { get; set; }
    }
}
