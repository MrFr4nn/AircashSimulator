using Domain.Entities.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashFrameV2
{
    public class AircashTransactionStatusResponseV2NoAmount
    {
        public AcFrameTransactionStatusEnum Status { get; set; }
        public int CurrencyId { get; set; }
        public string AircashTransactionId { get; set; }
        public string Signature { get; set; }
    }
}
