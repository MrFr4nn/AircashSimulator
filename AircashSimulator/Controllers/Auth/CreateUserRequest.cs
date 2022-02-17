using System;

namespace AircashSimulator.Controllers.Auth
{
    public class CreateUserRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public Guid PartnerId { get; set; }
        public string Email { get; set; }
    }
}
