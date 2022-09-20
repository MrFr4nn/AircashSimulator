using AircashSimulator.Extensions;
using Microsoft.AspNetCore.Mvc;
using Services.AircashPosDeposit;
using System.Threading.Tasks;

namespace AircashSimulator.Controllers.AircashPosDeposit
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AircashPosDepositController : ControllerBase
    {
        private UserContext UserContext;
        private IAircashPosDepositService AircashPosDepositService;

        public AircashPosDepositController(IAircashPosDepositService aircashPosDepositService, UserContext userContext)
        {
            AircashPosDepositService = aircashPosDepositService;
            UserContext = userContext;
        }

        [HttpPost]
        public async Task<IActionResult> CheckUser(CheckUserRQ checkUserRQ)
        {
            var response = await AircashPosDepositService.CheckUser(checkUserRQ.PhoneNumber, UserContext.GetUserId(User).ToString(), UserContext.GetPartnerId(User), checkUserRQ.Parameters);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CreatePayout(CreatePayoutRQ createPayoutRQ)
        {
            var response = await AircashPosDepositService.CreatePayout(UserContext.GetPartnerId(User), createPayoutRQ.Amount, createPayoutRQ.PhoneNumber, UserContext.GetUserId(User).ToString(), createPayoutRQ.Parameters);
            return Ok(response);
        }
    }
}
