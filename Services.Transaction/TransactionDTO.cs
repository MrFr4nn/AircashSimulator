using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Transaction
{
    public class TransactionDTO
    {
        public Guid TransactionId { get; set; }
        public string Description { get; set; }
        public string Location { get; set; }
        public DateTime? RequestTime { get; set; }
    }
}
