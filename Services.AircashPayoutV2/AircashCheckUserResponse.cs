using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashPayoutV2
{
    public class AircashCheckUserResponse
    {
        public int Status { get; set; }
        public List<Parameters> Parameters { get; set; }
    }
}
