using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashPay
{
    public class CancelTransactionDTO
    {
        public Guid PartnerId { get; set; }
        public Guid PartnerTransactionId { get; set; }
        public Guid UserId { get; set; }
    }
}
