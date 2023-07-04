using AircashSimulator.Extensions;
using Microsoft.AspNetCore.Mvc;
using Services.AircashATM;
using System.Threading.Tasks;

namespace AircashSimulator.Controllers.AircashATM
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AircashATMController: ControllerBase
    {
        private readonly IAircashATMService AircashATMService;
        private UserContext UserContext;
        public AircashATMController(IAircashATMService aircashATMService, UserContext userContext) 
        { 
            AircashATMService = aircashATMService;
            UserContext = userContext;
        }

        [HttpPost]
        public async Task<IActionResult> UseOneTimePayoutCode(UseOneTimePayoutCodeRQ useOneTimePayoutCodeRQ) {
            useOneTimePayoutCodeRQ.PartnerGuid = UserContext.GetPartnerId(User).ToString();
            var response = await AircashATMService.UseOneTimePayoutCode(useOneTimePayoutCodeRQ);
            return Ok(response);
        }
        [HttpPost]
        public async Task<IActionResult> CancelTransaction(CancelTransactionRQ cancelTransactionRQ)
        {
            cancelTransactionRQ.PartnerGuid = UserContext.GetPartnerId(User).ToString();
            var response = await AircashATMService.CancelTransaction(cancelTransactionRQ);
            return Ok(response);
        }
    }
}
