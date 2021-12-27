using AircashSignature;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashFrame
{
    public class AircashInitiateRequest : ISignature
    {
        public string PartnerId { get; set; }
        public string PartnerUserId { get; set; }
        public string PartnerTransactionId { get; set; }
        public string Amount { get; set; }
        public int Currency { get; set; }
        public int PayType { get; set; }
        public int PayMethod { get; set; }
        public string NotificationUrl { get; set; }
        public string SuccessUrl { get; set; }
        public string DeclineUrl { get; set; }
        public string Locale { get; set; }
        public string Signature { get; set; }
    }
}
