using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashPayment
{
    public class AircashPaymentResponseError
    {
        public bool Success { get; set; }
        List<Parameters> Parameters { get; set; }
        ResponseError Error { get; set; }
    }
}
