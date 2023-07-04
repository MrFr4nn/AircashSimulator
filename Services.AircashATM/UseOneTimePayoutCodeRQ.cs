using AircashSignature;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashATM
{
    public class UseOneTimePayoutCodeRQ: ISignature
    {
        public string AcCode { get; set;}
        public string PartnerTransactionID { get; set;}
        public string Signature { get; set;}
        public string PartnerGuid { get; set;}
    }
}
