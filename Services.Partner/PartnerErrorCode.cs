using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Partner
{
    public class PartnerErrorCode
    {
        public Guid? PartnerId { get; set; }
        public int Code { get; set; }
        public string LocoKey { get; set; }
        public string Description { get; set; }
    }
}
