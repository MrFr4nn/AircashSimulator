using AircashSignature;
using Domain.Entities.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashFrameV2
{
    public class AircashTransactionStatusV2ResponseV2 : ISignature
    {
        public AcFrameTransactionStatusEnum Status { get; set; }
        public decimal? Amount { get; set; }
        public int CurrencyId { get; set; }
        public string AircashTransactionId { get; set; }
        public List<CustomParameterModel> Parameters { get; set; }
        public string Signature { get; set; }
    }
}
