using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashPayStaticCode
{
    public class GenerateQRLinkDTO
    {
       // public Guid PartnerId { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; }
        public string Location { get; set; }
    }
}
