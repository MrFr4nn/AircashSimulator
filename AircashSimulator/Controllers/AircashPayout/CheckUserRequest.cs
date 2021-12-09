using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AircashSimulator.Controllers
{
    public class CheckUserRequest
    {
        public string PhoneNumber { get; set; }
        public string PartnerUserId { get; set; }
    }
}
