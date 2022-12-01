using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashPosDeposit
{
    public class AircashMatchPersonalDataRS
    {
        public bool matchResult { get; set; }
        public decimal score { get; set; }
        public bool birthDateMatch { get; set; }
    }
}
