using System;
using System.Threading.Tasks;

namespace Services.Authentication
{
    public interface IAuthenticationService
    {
        Task<string> Login(string username, string password);
        Task ValidateAdmin(Guid partnerId);
    }
}