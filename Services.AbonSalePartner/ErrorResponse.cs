using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AbonSalePartner
{
    public class ErrorResponse
    {
        public int Code { get; set; }
        public string Message { get; set; }
        public Data AdditionalData { get; set; }
    }
}
