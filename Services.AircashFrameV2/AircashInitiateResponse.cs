using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashFrameV2
{
    public class AircashInitiateResponse
    {
        public Guid TransactionId { get; set; }
        public string Url { get; set; }
    }
}
