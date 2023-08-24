using AircashSimulator.Configuration;
using AircashSimulator;
using DataAccess;
using Domain.Entities;
using Domain.Entities.Enum;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Service.Settings;

namespace Services.Authentication
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly JwtConfiguration JwtConfiguration;
        private readonly AircashSimulatorContext AircashSimulatorContext;
        private readonly ISettingsService SettingsService;
        private Guid DefaultPartnerID => new Guid("8F62C8F0-7155-4C0E-8EBE-CD9357CFD1BF");

        public AuthenticationService(IOptionsMonitor<JwtConfiguration> jwtConfiguration, AircashSimulatorContext aircashSimulatorContext, ISettingsService settingsService)
        {
            JwtConfiguration = jwtConfiguration.CurrentValue;
            AircashSimulatorContext = aircashSimulatorContext;
            SettingsService = settingsService;
        }

        public async Task<string> Login(string username, string password)
        {
            var user = await AircashSimulatorContext.Users.Where(u => u.Username == username).SingleOrDefaultAsync();

            if (user is null)
                throw new SimulatorException(SimulatorExceptionErrorEnum.InvalidUsername, "invalid username");

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
                throw new SimulatorException(SimulatorExceptionErrorEnum.InvalidPassword, "Invalid password");

            var partner = await AircashSimulatorContext.Partners.Where(p => p.PartnerId == user.PartnerId).SingleOrDefaultAsync();
            var partnerRoleEntityList = await AircashSimulatorContext.PartnerRoles.Where(r => r.PartnerId == partner.PartnerId).ToListAsync();
            var partnerRoles = new List<string>();
            foreach (var partnerRoleEntity in partnerRoleEntityList)
            {
                partnerRoles.Add(partnerRoleEntity.PartnerRole.ToString());
            }
            var partnerIds = new PartnerIdDTO
            {
                AbonOnlinePartnerId = SettingsService.AbonOnlinePartnerId.ToString(),
                AbonOnlinePartnerIdWithoutAuthorization = SettingsService.AbonOnlinePartnerIdWithoutAuthorization.ToString(),
                AbonGeneratePartnerId = SettingsService.AbonGeneratePartnerId.ToString(),
                AircashFramePartnerId = SettingsService.AircashFramePartnerId.ToString(),
                AircashFramePartnerIdWithMatchPersonalData = SettingsService.AircashFramePartnerIdWithMatchPersonalData.ToString(),
                SalesPartnerId = SettingsService.SalesPartnerId.ToString(),
                AircashPayoutV4PartnerId = SettingsService.AircashPayoutV4PartnerId.ToString(),
                AircashPayoutPartnerId = SettingsService.AircashPayoutPartnerId.ToString(),
                C2DPayoutPartnerId = SettingsService.C2DPayoutPartnerId.ToString(),
                C2DDepositPartnerId = SettingsService.C2DDepositPartnerId.ToString(),
                AcPayPartnerId = SettingsService.AcPayPartnerId.ToString(),
                InAppPayPartnerId = SettingsService.InAppPayPartnerId.ToString(),
                DefaulrPartnerId = DefaultPartnerID.ToString(),
            };
            var partnerId = partner.PartnerId;
            if (partner.PrivateKey != null && partner.PrivateKey != "")
            {
                partnerIds.AbonOnlinePartnerId = partnerId.ToString();
                partnerIds.AbonOnlinePartnerIdWithoutAuthorization = partnerId.ToString();
                partnerIds.AbonGeneratePartnerId = partnerId.ToString();
                partnerIds.AircashFramePartnerId = partnerId.ToString();
                partnerIds.AircashFramePartnerIdWithMatchPersonalData = partnerId.ToString();
                partnerIds.SalesPartnerId = partnerId.ToString();
                partnerIds.AircashPayoutPartnerId = partnerId.ToString();
                partnerIds.AircashPayoutV4PartnerId = partnerId.ToString();
                partnerIds.C2DPayoutPartnerId = partnerId.ToString();
                partnerIds.C2DDepositPartnerId = partnerId.ToString();
                partnerIds.AcPayPartnerId = partnerId.ToString();
                partnerIds.InAppPayPartnerId = partnerId.ToString();
                partnerIds.DefaulrPartnerId = partnerId.ToString();
            }

            var claims = new List<Claim>();
            claims.Add(new Claim("partnerId", partnerId.ToString()));
            claims.Add(new Claim("partnerIdsDTO", JsonConvert.SerializeObject(partnerIds)));
            claims.Add(new Claim("username", user.Username));
            claims.Add(new Claim(ClaimTypes.Email, user.Email));
            claims.Add(new Claim("userId", user.UserId.ToString()));
            claims.Add(new Claim("partnerRoles", JsonConvert.SerializeObject(partnerRoles)));
            claims.Add(new Claim("userFirstName", user?.FirstName ?? ""));
            claims.Add(new Claim("userLastName", user?.LastName ?? ""));
            claims.Add(new Claim("userBirthDate", user.BirthDate.HasValue ? user.BirthDate.Value.ToString("yyyy-MM-dd") : ""));
            claims.Add(new Claim("userPhoneNumber", user?.PhoneNumber ?? ""));
            claims.Add(new Claim("email", user.Email));
            claims.Add(new Claim("partnerName", partner.PartnerName));
            claims.Add(new Claim("enviroment", user.Environment.ToString()));

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

        public async Task ValidateAdmin(Guid partnerId)
        {
            var authorizedPartners = await AircashSimulatorContext.PartnerRoles.Where(x => x.PartnerRole == RoleEnum.Admin).Select(x => x.PartnerId).ToListAsync();
            if (!authorizedPartners.Contains(partnerId))
                throw new UnauthorizedAccessException();
        }
    }
}
