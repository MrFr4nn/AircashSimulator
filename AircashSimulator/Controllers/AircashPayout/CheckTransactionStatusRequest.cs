using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AircashSimulator.Controllers.AircashPayout
{
    public class CheckTransactionStatusRequest
    {
        public Guid PartnerId { get; set; }
        public Guid PartnerTransactionId { get; set; }
        public Guid AircashTransactionId { get; set; }
    }
}
