using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.Authentication;
using Services.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AircashSimulator.Controllers.User
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class PartnerController : ControllerBase
    {
        private readonly IAuthenticationService AuthenticationService;
        private readonly IUserService UserService;
        public PartnerController(IAuthenticationService authenticationService, IUserService userService)
        {
            AuthenticationService = authenticationService;
            UserService = userService;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetUsers()
        {
            var users = await UserService.GetUsers();
            return Ok(users);
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetUserDetail(Guid userId)
        {
            var user = await UserService.GetUserDetail(userId);
            return Ok(user);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> SaveUser(UserDetailVM request)
        {
            await UserService.SaveUser(request);
            return Ok();
        }
    }
}
