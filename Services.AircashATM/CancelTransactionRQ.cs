using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AircashSignature;

namespace Services.AircashATM
{
    public class CancelTransactionRQ: ISignature
    {
        public string PartnerTransactionID { get; set;}
        public string Signature { get; set;}
        public string PartnerGuid { get; set;}
    }
}
