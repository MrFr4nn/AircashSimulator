using AircashSimulator.Configuration;
using DataAccess;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Services.Authentication
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly JwtConfiguration JwtConfiguration;
        private readonly AircashSimulatorContext AircashSimulatorContext;

        public AuthenticationService(IOptionsMonitor<JwtConfiguration> jwtConfiguration, AircashSimulatorContext aircashSimulatorContext)
        {
            JwtConfiguration = jwtConfiguration.CurrentValue;
            AircashSimulatorContext = aircashSimulatorContext;
        }
        public async Task CreateUser(string username, string password, Guid partnerId, string email)
        {
            string hash = "";
            using (SHA256 sha256Hash = SHA256.Create())
            {
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(password));
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                hash = builder.ToString();
            }
            
            await AircashSimulatorContext.Users.AddAsync(new UserEntity
            {
                UserId = Guid.NewGuid(),
                Username = username,
                Email = email,
                PartnerId = partnerId,
                PasswordHash = hash
            });
           
            await AircashSimulatorContext.SaveChangesAsync();
        }

        public async Task<string> Login(string username, string password)
        {
            var user = await AircashSimulatorContext.Users.Where(u => u.Username == username).SingleOrDefaultAsync();
            
            if (user is null)
                throw new Exception("User not found");
            
            string passwordHash = "";
            using (SHA256 sha256Hash = SHA256.Create())
            {
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(password));
                StringBuilder builder = new();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                passwordHash = builder.ToString();
            }
            if (user.PasswordHash != passwordHash)
                throw new Exception("Invalid password");

            var partner = await AircashSimulatorContext.Partners.Where(p => p.PartnerId == user.PartnerId).SingleOrDefaultAsync();

            var claims = new List<Claim>();
            claims.Add(new Claim("partnerId", partner.PartnerId.ToString()));
            claims.Add(new Claim("username", user.Username));
            claims.Add(new Claim(ClaimTypes.Email, user.Email));
            claims.Add(new Claim("userId", user.UserId.ToString()));

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JwtConfiguration.Secret));
            var signingCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                JwtConfiguration.Issuer,
                JwtConfiguration.Audience,
                claims,
                DateTime.UtcNow,
                DateTime.UtcNow.AddMinutes(JwtConfiguration.AccessTokenExpiration),
                signingCredentials
                );

            var tokenJson = new JwtSecurityTokenHandler().WriteToken(token);

            return tokenJson;
        }
    }
}
