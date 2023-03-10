using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashPayoutV2
{
    public class AircashCheckTransactionStatusResponse
    {
        public int Status { get; set; }
        public string AircashTransactionId { get; set; }
    }
}
