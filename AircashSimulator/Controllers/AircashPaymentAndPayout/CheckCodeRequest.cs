using Domain.Entities.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AircashSimulator.Controllers.AircashPaymentAndPayout
{
    public class CheckCodeRequest
    {
        public string PartnerId { get; set; }
        public string BarCode { get; set; }
        public string LocationID { get; set; }
        public EnvironmentEnum Environment { get; set; }
    }
}
