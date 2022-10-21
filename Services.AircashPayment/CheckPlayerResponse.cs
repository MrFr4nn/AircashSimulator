using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashPayment
{
    public class CheckPlayerResponse
    {
        public bool IsPlayer { get; set; }
        public ResponseError Error { get; set; }
        public List<Parameters> Parameters { get; set; }



    }
}
