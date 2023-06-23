
using Domain.Entities.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.User
{
    public class UserDetailVM
    {
        public string? UserId { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public PartnerVM Partner { get; set; }
        public string  Password { get; set; }
        public EnvironmentEnum Environment { get; set; }
    }
}
