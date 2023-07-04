using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashATM
{
    public class UseOneTimePayoutCodeRS
    {
        public bool Success { get; set; }
        public OneTimePayoutCodeTransaction TransactionInformation { get; set; }
        public ErrorResponse Error { get; set; }
    }
}
