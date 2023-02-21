using Services.AircashPosDeposit;
using System.Collections.Generic;

namespace AircashSimulator.Controllers.AircashPosDeposit
{
    public class CheckUserRQ
    {
        public string PhoneNumber { get; set; }
        public List<AdditionalParameter> Parameters { get; set; }
    }
}
