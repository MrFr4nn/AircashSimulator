using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AircashSimulator.Controllers
{
    public class CheckTransactionStatusRequest
    {
        public Guid PartnerTransactionId { get; set; }
    }
}
