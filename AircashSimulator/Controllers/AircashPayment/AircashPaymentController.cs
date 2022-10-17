using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using AircashSignature;
using AircashSimulator.Controllers.AircashPayment;
using AircashSimulator.Configuration;
using Microsoft.Extensions.Options;
using Services.AircashPaymentAndPayout;
using Services.AircashPayment;

namespace AircashSimulator.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AircashPaymentController : Controller
    {
        private AircashConfiguration AircashConfiguration;
        private IAircashPaymentService AircashPaymentService;

        public AircashPaymentController(IOptionsMonitor<AircashConfiguration> aircashConfiguration,IAircashPaymentService aircashPaymentService)
        {
            AircashConfiguration = aircashConfiguration.CurrentValue;
            AircashPaymentService = aircashPaymentService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateAndConfirmPayment(AircashPaymentCreateAndConfirmPayment aircashPaymentCreateAndConfirmPayment)
        {
            var dataToVerify = AircashSignatureService.ConvertObjectToString(aircashPaymentCreateAndConfirmPayment);
            var signature = aircashPaymentCreateAndConfirmPayment.Signature;
            bool valid = AircashSignatureService.VerifySignature(dataToVerify, signature, $"{AircashConfiguration.AcPayPublicKey}");

            if (valid == true)
            {





                return Ok();
            }
            else
            {
                return BadRequest("Invalid signature");
            }


        }



    }
}
