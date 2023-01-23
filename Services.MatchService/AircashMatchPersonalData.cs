using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.MatchService
{
    public class AircashMatchPersonalData
    {
        public Guid PartnerID { get; set; }
        public PersonalData AircashUser { get; set; }
        public PersonalData PartnerUser { get; set; }
    }
}
