using Services.AircashPayment;
using System.Collections.Generic;

namespace AircashSimulator.Controllers.AircashPayment
{
    public class CreateAndConfirmPartnerRequest
    {
        public string Endpoint { get; set; }
        public string TransactionId { get; set; }
        public decimal Amount { get; set; }
        public List<AircashPaymentParameters> Parameters { get; set; }
    }
}
