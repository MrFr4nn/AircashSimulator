using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashPayout
{
    public class CheckUserv4DTO
    {
        public Guid PartnerID { get; set; }
        public string PhoneNumber { get; set; }
        public Guid PartnerUserID { get; set; }
        public List<Parameter> Parameters { get; set; }
    }
}
