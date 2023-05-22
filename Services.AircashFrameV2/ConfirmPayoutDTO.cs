using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashFrameV2
{
    public class ConfirmPayoutDTO
    {
        public decimal Amount { get; set; }
        public Guid PartnerTransactionId { get; set; }
    }
}
