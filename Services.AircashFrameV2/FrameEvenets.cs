using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashFrameV2
{
    public class FrameEvenets
    {
        public string DateTimeUTC { get; set; } 
        public string Description { get; set; } = string.Empty;
        public int Code { get; set; }
    }
}
