using Domain.Entities.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AircashSimulator.Controllers.AircashPayout
{
    public class CreatePayoutRequest
    {
        public Guid PartnerID { get; set; }
        public Guid PartnerUserID { get; set; }
        public Guid PartnerTransactionID { get; set; }
        public CurrencyEnum CurrencyID { get; set; }
        public decimal Amount { get; set; }
        public string PhoneNumber { get; set; }
    }
}
