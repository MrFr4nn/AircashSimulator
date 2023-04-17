using Domain.Entities.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AircashSimulator.Controllers.AircashPayout
{
    public class CreatePayoutRequest
    {
        public decimal Amount { get; set; }
        public string PhoneNumber { get; set; }
        public EnvironmentEnum Environment { get; set; }
    }
}
