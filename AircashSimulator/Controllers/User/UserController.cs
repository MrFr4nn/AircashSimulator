using AircashSimulator.Extensions;
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
    public class UserController : ControllerBase
    {
        private readonly IAuthenticationService AuthenticationService;
        private readonly IUserService UserService;
        private readonly UserContext UserContext;
        public UserController(IAuthenticationService authenticationService, IUserService userService, UserContext userContext)
        {
            AuthenticationService = authenticationService;
            UserService = userService;
            UserContext = userContext;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetUsers()
        {
            await AuthenticationService.ValidateAdmin(UserContext.GetPartnerId(User));

            var users = await UserService.GetUsers();
            return Ok(users);
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetUserDetail(Guid userId)
        {
            await AuthenticationService.ValidateAdmin(UserContext.GetPartnerId(User));

            var user = await UserService.GetUserDetail(userId);
            return Ok(user);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> SaveUser(UserDetailVM request)
        {
            await AuthenticationService.ValidateAdmin(UserContext.GetPartnerId(User));

            await UserService.SaveUser(request);
            return Ok();
        }
    }
}
