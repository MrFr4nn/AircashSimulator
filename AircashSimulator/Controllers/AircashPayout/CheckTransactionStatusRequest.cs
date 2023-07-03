using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AircashSimulator.Controllers.AircashPayout
{
    public class CheckTransactionStatusRequest
    {
        public Guid PartnerId { get; set; }
        public string PartnerTransactionId { get; set; }
        public string AircashTransactionId { get; set; }
    }
}
