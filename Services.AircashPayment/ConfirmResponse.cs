using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashPayment
{
    public class ConfirmResponse
    {
            public int ResponseCode { get; set; }
            public string CancelTransactionID { get; set; }
        
    }
}
