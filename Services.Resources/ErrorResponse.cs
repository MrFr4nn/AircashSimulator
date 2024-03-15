using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Resources
{
    public class ErrorResponse
    {
        public int Code { get; set; }
        public string Message { get; set; }
        public Data AdditionalData { get; set; }
    }
    public class Data
    {
        public string SerialNumber { get; set; }
        public decimal Value { get; set; }
        public string IsoCurrencySymbol { get; set; }
        public string PartnerTransactionId { get; set; }
    }
}
