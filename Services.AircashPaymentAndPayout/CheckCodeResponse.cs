using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashPaymentAndPayout
{
    class CheckCodeResponse
    {
        public string BarCode { get; set; }
        public decimal Amount { get; set; }
    }
}
