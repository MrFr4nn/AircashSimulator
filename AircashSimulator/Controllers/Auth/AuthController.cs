using Microsoft.AspNetCore.Mvc;
using Services.Authentication;
using System.Threading.Tasks;

namespace AircashSimulator.Controllers.Auth
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthenticationService AuthenticationService;

        public AuthController(IAuthenticationService authenticationService)
        {
            AuthenticationService = authenticationService;
        }

        [HttpPost("Login")]
        public async Task<string> Login(LoginRequest login)
        {
            var token = await AuthenticationService.Login(login.Username, login.Password);
            return token;
        }

        [HttpPost("CreateUser")]
        public async Task<IActionResult> CreateUser(CreateUserRequest createUserRequest)
        {
            await AuthenticationService.CreateUser(createUserRequest.Username, createUserRequest.Password, createUserRequest.PartnerId, createUserRequest.Email);
            return Ok();
        }
    }
}
