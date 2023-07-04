using System;

namespace Services.Transaction
{
    public class TransactionDTO
    {
        public string TransactionId { get; set; }
        public string Description { get; set; }
        public string Location { get; set; }
        public DateTime? RequestTime { get; set; }
    }
}
