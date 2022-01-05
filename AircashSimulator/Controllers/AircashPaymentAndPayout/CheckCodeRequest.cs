using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AircashSimulator.Controllers.AircashPaymentAndPayout
{
    public class CheckCodeRequest
    {
        public string BarCode { get; set; }
        public string LocationID { get; set; }
    }
}
