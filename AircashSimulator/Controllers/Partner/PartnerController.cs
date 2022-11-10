using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Services.Partner;
using System;
using AircashSimulator.Extensions;
using DataAccess;
using System.Linq;
using Services.Authentication;

namespace AircashSimulator.Controllers.Partner
{

    [Route("api/[controller]/[action]")]
    [ApiController]
    public class PartnerController : ControllerBase
    {
        private readonly IPartnerService PartnerService;
        private readonly IAuthenticationService AuthenticationService;
        private readonly UserContext UserContext;

        public PartnerController(IPartnerService partnerService, UserContext userContext, IAuthenticationService authenticationService)
        {
            PartnerService = partnerService;
            UserContext = userContext;
            AuthenticationService = authenticationService;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetPartners()
        {
            await AuthenticationService.ValidateAdmin(UserContext.GetPartnerId(User));

            var partners = await PartnerService.GetPartners();
            return Ok(partners);
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetRoles()
        {
            await AuthenticationService.ValidateAdmin(UserContext.GetPartnerId(User));

            var roles = PartnerService.GetRoles();
            return Ok(roles);
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetPartnerDetails()
        {
            await AuthenticationService.ValidateAdmin(UserContext.GetPartnerId(User));

            var partners = await PartnerService.GetPartnerDetails();
            return Ok(partners);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> SavePartner(PartnerDetailVM request)
        {
            await AuthenticationService.ValidateAdmin(UserContext.GetPartnerId(User));
            await PartnerService.SavePartner(request);
            return Ok("Ok");
        }

        public async Task<IActionResult> DeletePartner(Guid PartnerId)
        {
            await AuthenticationService.ValidateAdmin(UserContext.GetPartnerId(User));
            await PartnerService.DeletePartner(PartnerId);
            return Ok();
        }


    }
}
