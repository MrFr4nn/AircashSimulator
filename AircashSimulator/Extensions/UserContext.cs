using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace AircashSimulator.Extensions
{
    public class UserContext
    {
        public string GetUserId(ClaimsPrincipal user)
        {
            return user.FindFirst("userId")?.Value;
        }

        public Guid GetPartnerId(ClaimsPrincipal user)
        {
            return new Guid(user.FindFirst("partnerId")?.Value);
        }
    }
}
