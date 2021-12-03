using Domain.Entities.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AircashSimulator.Controllers
{
    public class GeneratePartnerCodeRequest
    {
        public string PartnerId { get; set; }
        public decimal Amount { get; set; }
        public string ISOCurrencyId { get; set; }
        public string Description { get; set; }
        public int ValidForPeriod { get; set; }
        public string LocationId { get; set; }
    }
}
