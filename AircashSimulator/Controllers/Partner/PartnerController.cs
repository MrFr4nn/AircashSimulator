using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Services.Partner;
using System;

namespace AircashSimulator.Controllers.Partner
{

    [Route("api/[controller]/[action]")]
    [ApiController]
    public class PartnerController : ControllerBase
    {
        private readonly IPartnerService PartnerService;
        public PartnerController(IPartnerService partnerService)
        {
            PartnerService = partnerService;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetPartners()
        {
            var partners = await PartnerService.GetPartners();
            return Ok(partners);
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetRoles()
        {
            var roles = PartnerService.GetRoles();
            return Ok(roles);
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetPartnerDetails(Guid partnerId)
        {
            var partner = await PartnerService.GetPartnerDetails(partnerId);
            return Ok(partner);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> SavePartner(PartnerDetailVM request)
        {
            await PartnerService.SavePartner(request);
            return Ok();
        }
    }
}
