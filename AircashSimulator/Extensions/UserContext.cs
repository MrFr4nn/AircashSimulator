using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace AircashSimulator.Extensions
{
    public class UserContext
    {
        public Guid GetUserId(ClaimsPrincipal user)
        {
            return new Guid(user.FindFirst("userId")?.Value);
        }

        public Guid GetPartnerId(ClaimsPrincipal user)
        {
            return new Guid(user.FindFirst("partnerId")?.Value);
        }
    }
}
