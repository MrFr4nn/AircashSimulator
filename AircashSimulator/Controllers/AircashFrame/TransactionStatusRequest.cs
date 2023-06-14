
using System;

namespace AircashSimulator.Controllers.AircashFrame
{
    public class TransactionStatusRequest
    {
        public Guid PartnerId { get; set; }
        public string TransactionId { get; set; }
    }
}
