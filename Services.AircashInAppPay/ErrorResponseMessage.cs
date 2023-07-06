using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashInAppPay
{
    public class ErrorResponseMessage
    {
        public int Code { get; set; }
        public string Message { get; set; }
        public List<Parameter> AdditionalData { get; set; }
    }
    public class Parameter
    { 
        public string Key { get; set; }
        public string Value { get; set; }
    }
}
