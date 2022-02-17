using AircashSimulator.Configuration;
using AircashSimulator.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Services.PartnerAbonDenominations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AircashSimulator.Controllers.PartnerAbonDenominations
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class DenominationsController : ControllerBase
    {
        private IPartnerAbonDenominationService PartnerAbonDenominationService;
        private UserContext UserContext;
        public DenominationsController(IPartnerAbonDenominationService denominationService, UserContext userContext)
        {
            PartnerAbonDenominationService = denominationService;
            UserContext = userContext;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetDenominations()
        {
            var response = await PartnerAbonDenominationService.GetDenominations(UserContext.GetPartnerId(User));
            return Ok(response);
        }
    }
}
