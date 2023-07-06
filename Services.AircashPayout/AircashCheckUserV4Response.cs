using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashPayout
{
    public class AircashCheckUserV4Response
    {
        public int Status { get; set; }
        public List<Parameter> Parameters { get; set; }
    }
}
