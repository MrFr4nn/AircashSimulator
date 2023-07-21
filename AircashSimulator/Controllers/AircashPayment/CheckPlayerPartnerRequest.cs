using Services.AircashPayment;
using System.Collections.Generic;

namespace AircashSimulator.Controllers.AircashPayment
{
    public class CheckPlayerPartnerRequest
    {
        public string Endpoint { get; set; }
        public List<AircashPaymentParameters> Parameters { get; set; }
    }
}
