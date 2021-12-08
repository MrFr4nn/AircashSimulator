using Microsoft.AspNetCore.Mvc;
using Services.AircashPayout;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AircashSimulator.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AircashPayoutController : ControllerBase
    {
        private IAircashPayoutService AircashPayoutService;
        public AircashPayoutController(IAircashPayoutService aircashPayoutService)
        {
            AircashPayoutService = aircashPayoutService;
        }

        [HttpPost]
        public async Task<IActionResult> CheckUser(CheckUserRequest checkUserRequest)
        {
            var response = await AircashPayoutService.CheckUser(checkUserRequest.PhoneNumber, checkUserRequest.PartnerUserId, new Guid("8F62C8F0-7155-4C0E-8EBE-CD9357CFD1BF"));
            return Ok(response);
        }
    }

}
