using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashPayment
{
    public class ResponseError
    {
        public int ErrorCode { get; set; }
        public string ErrorMessage { get; set; }
    }
}
