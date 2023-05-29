using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AircashSimulator.Controllers
{
    public class CheckUserRequest
    {
        public Guid PartnerID { get; set; }
        public Guid PartnerUserID { get; set; }
        public string PhoneNumber { get; set; }
    }
}
