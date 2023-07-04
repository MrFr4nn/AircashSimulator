using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashPayout
{
    public class AircashCreatePayoutV4Response
    {
        public string AircashTransactionId { get; set; }
        public List<Parameter> Parameters { get; set; }
    }
}
