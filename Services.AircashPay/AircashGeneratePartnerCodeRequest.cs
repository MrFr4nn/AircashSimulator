using AircashSignature;
using Domain.Entities.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashPay
{
    class AircashGeneratePartnerCodeRequest : ISignature
    {
        public Guid PartnerID { get; set; }
        public decimal Amount { get; set; }
        public CurrencyEnum CurrencyID { get; set; }
        public Guid PartnerTransactionID { get; set; }
        public string Description { get; set; }
        public string LocationID { get; set; }
        public string Signature { get; set; }
    }
}
