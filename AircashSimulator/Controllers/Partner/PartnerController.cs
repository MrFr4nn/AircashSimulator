using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Services.Partner;
using System;
using AircashSimulator.Extensions;
using DataAccess;
using System.Linq;
using Services.Authentication;
using Domain.Entities.Enum;
using System.Collections.Generic;
using Services.User;
using Org.BouncyCastle.Asn1.Ocsp;

namespace AircashSimulator.Controllers.Partner
{

    [Route("api/[controller]/[action]")]
    [ApiController]
    public class PartnerController : ControllerBase
    {
        private readonly IPartnerService PartnerService;
        private readonly IAuthenticationService AuthenticationService;
        private readonly UserContext UserContext;

        private readonly EnvironmentEnum Environment = EnvironmentEnum.Staging;
        private readonly bool UseDefaultPartner = true;

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
        public async Task<IActionResult> GetPartnerSettingRoles()
        {
            await AuthenticationService.ValidateAdmin(UserContext.GetPartnerId(User));

            var roles = PartnerService.GetPartnerSettingRoles();
            return Ok(roles);
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetPartnersDetail(int pageSize, int pageNumber, string search)
        {
            await AuthenticationService.ValidateAdmin(UserContext.GetPartnerId(User));

            var partners = await PartnerService.GetPartnersDetail(pageSize, pageNumber, search);
            return Ok(partners);
        }
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetPartnerSetting(Guid partnerId)
        {
            await AuthenticationService.ValidateAdmin(UserContext.GetPartnerId(User));

            var partnersetting = await PartnerService.GetPartnerSetting(partnerId);
            return Ok(partnersetting);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> SavePartner(SavePartnerVM request)
        {
            await AuthenticationService.ValidateAdmin(UserContext.GetPartnerId(User));
            await PartnerService.SavePartner(request);
            return Ok("Ok");
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> SavePartnerV2(SavePartnerVM request)
        {
            request.Environment = Environment;
            request.UseDefaultPartner = UseDefaultPartner;
            await AuthenticationService.ValidateAdmin(UserContext.GetPartnerId(User));
            await PartnerService.SavePartner(request);
            return Ok("Ok");
        }
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> SavePartnerSetting(SavePartnerSettingVM request)
        {
            await AuthenticationService.ValidateAdmin(UserContext.GetPartnerId(User));
            await PartnerService.SavePartnerSetting(request);
            return Ok("Ok");
        }
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> DeletePartner(PartnerDetailVM Partner)
        {
            await AuthenticationService.ValidateAdmin(UserContext.GetPartnerId(User));
            await PartnerService.DeletePartner(Partner);
            return Ok();
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetPartnerDetail(Guid partnerId)
        {
            await AuthenticationService.ValidateAdmin(UserContext.GetPartnerId(User));
            var partner = await PartnerService.GetPartnerDetail(partnerId);
            return Ok(partner);
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetOptions()
        {
            await AuthenticationService.ValidateAdmin(UserContext.GetPartnerId(User));
            var options = await PartnerService.GetOptions();
            return Ok(options);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> SavePartnerSite(SavePartnerSite request) 
        {
            await AuthenticationService.ValidateAdmin(UserContext.GetPartnerId(User));
            await PartnerService.SavePartnerSite(request);
            return Ok("Ok");
        }

       
    }
}