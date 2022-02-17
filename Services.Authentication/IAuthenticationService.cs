using System;
using System.Threading.Tasks;

namespace Services.Authentication
{
    public interface IAuthenticationService
    {
        Task<string> Login(string username, string password);
        Task CreateUser(string username, string password, Guid partnerId, string email);
    }
}