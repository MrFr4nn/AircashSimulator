using Services.AircashPosDeposit;
using System.Collections.Generic;

namespace AircashSimulator.Controllers.AircashPosDeposit
{
    public class CreatePayoutRQ
    {
        public decimal Amount { get; set; }
        public string PhoneNumber { get; set; }
        public List<Parameter> Parameters { get; set; }
    }
}
