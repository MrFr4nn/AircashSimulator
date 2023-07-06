using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashATM
{
    public class CancelTransactionRS
    {
        public Guid TransactionID { get; set; }
        public bool Success { get; set; }
        public ErrorResponse Error { get; set; }
    }
}
