using AircashSignature;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashPaymentAndPayout
{
    public class CheckCodeRequest: ISignature
    {
        public string PartnerID { get; set; }
        public string BarCode { get; set; }
        public string LocationID { get; set; }
        public string Signature { get; set; }
    }
}
