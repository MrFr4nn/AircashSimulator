using Domain.Entities.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashFrameV2
{
    public class CancelPayoutDTO
    {
        public Guid PartnerId { get; set; }
        public string PartnerTransactionId { get; set; }
    }
}
