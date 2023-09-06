using AircashSignature;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.CobrandedCard
{
    public class UpdateStatusCardRQ : ISignature
    {
        public Guid PartnerID { get; set; }
        public string PartnerCardID { get; set; }
        public DateTime DateTimeUTC { get; set; }
        public int OldStatus { get; set; }
        public int NewStatus { get; set; }
        public int? DenialStatusDetails { get; set; }
        public string Signature { get; set; }
    }
}
