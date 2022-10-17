using DataAccess;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashPayment
{
    public class AircashPaymentService : IAircashPaymentService
    {
        private AircashSimulatorContext AircashSimulatorContext;

        public AircashPaymentService(AircashSimulatorContext aircashSimulatorContext)
        {
            AircashSimulatorContext = aircashSimulatorContext;
        }

        public async Task<object> CreateAndConfirmPayment()
        {
            return Ok()
        }


    }
}
