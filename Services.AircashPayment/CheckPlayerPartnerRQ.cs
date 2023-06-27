using AircashSignature;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashPayment
{
    public class CheckPlayerPartnerRQ : ISignature
    {
        public List<AircashPaymentParameters> Parameters { get; set; }
        public string Signature { get; set; }
    }
}
