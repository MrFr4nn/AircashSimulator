using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashPay
{
    public class ErrorResponse
    {
        public int Code { get; set; }
        public string Message { get; set; }
    }
}
