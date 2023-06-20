using DataAccess;
using Domain.Entities;
using Domain.Entities.Enum;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using AircashSimulator.Extensions;
using System.Text;
using System.Security.Cryptography;
using Services.User;
using AircashSimulator;

namespace Services.Partner
{
    public class PartnerService : IPartnerService
    {
        private AircashSimulatorContext AircashSimulatorContext;
        private IUserService UserService;

        private const string DefaultPrivateKey = "";
        private const string DefaultPrivateKeyPass = "";

        public PartnerService(AircashSimulatorContext aircashSimulatorContext, IUserService userService)
        {
            AircashSimulatorContext = aircashSimulatorContext;
            UserService = userService;
        }

        public async Task<List<PartnerVM>> GetPartners()
        {
            var partners = await AircashSimulatorContext.Partners.Select(x => new PartnerVM
            {
                Id = x.PartnerId,
                Name = x.PartnerName
            }).ToListAsync();

            return partners;
        }

        public List<Role> GetRoles()
        {
            var roles = Enum.GetValues(typeof(RoleEnum)).Cast<RoleEnum>().ToList().Select(x => new Role { RoleId = x, RoleName = x.ToString() }).ToList();
            roles.Remove(roles.Where(x => x.RoleId == RoleEnum.Admin).FirstOrDefault());
            return roles;
        }

        public async Task<List<PartnerDetailVM>> GetPartnersDetail(int pageSize, int pageNumber, string search)
        {
            Expression<Func<PartnerEntity, bool>> predicate = x => true;

            if (!String.IsNullOrEmpty(search))
                predicate = predicate.AndAlso(x => x.PartnerName.Contains(search));

            var partners = await AircashSimulatorContext.Partners
                    .Where(predicate).OrderBy(t => t.PartnerName)
                    .Select(x => new PartnerDetailVM
                    {
                        PartnerId = x.PartnerId,
                        PartnerName = x.PartnerName,
                        PrivateKey = x.PrivateKey,
                        PrivateKeyPass = x.PrivateKeyPass,
                        CurrencyId = x.CurrencyId,
                        CountryCode = x.CountryCode,
                        Environment = x.Environment,
                        Roles = null,
                        UseDefaultPartner = x.UseDefaultPartner
                    })
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize).ToListAsync();

            if (partners != null)
            {
                List<Role> roles = GetRoles();
                var partnersRoles = AircashSimulatorContext.PartnerRoles.Select(r => new PartnerRoleEntity { PartnerId = r.PartnerId, PartnerRole = r.PartnerRole }).ToList();

                foreach (var p in partners)
                {
                    List<PartnerRoleEntity> partnerRole = partnersRoles.Where(a => a.PartnerId == p.PartnerId).ToList();
                    if (partnerRole.Count() > 0)
                    {
                        p.Roles = roles.Where(r => partnerRole.Select(r => r.PartnerRole).Contains(r.RoleId)).ToList();
                    }
                }
            }
            return partners;
        } 

        public async Task SavePartner(SavePartnerVM request)
        {
            Guid id;
            if (request.PartnerId != null)
            {
                var partner = await AircashSimulatorContext.Partners.FirstOrDefaultAsync(x => x.PartnerId == request.PartnerId);
                id = partner.PartnerId;
                partner.PartnerName = request.PartnerName;
                partner.CurrencyId = request.CurrencyId;
                partner.CountryCode = request.CountryCode;
                partner.Environment = request.Environment;
                partner.UseDefaultPartner = request.UseDefaultPartner;

                var roles = await AircashSimulatorContext.PartnerRoles.Where(x => x.PartnerId == request.PartnerId).ToListAsync();
                foreach (var role in roles)
                {
                    if (role.PartnerRole != RoleEnum.Admin)
                    {
                        AircashSimulatorContext.PartnerRoles.Remove(role);
                    }
                }

                AircashSimulatorContext.Partners.Update(partner);
            }
            else
            {
                id = Guid.NewGuid();
                await AircashSimulatorContext.Partners.AddAsync(new PartnerEntity
                {
                    PartnerId = id,
                    PartnerName = request.PartnerName,
                    PrivateKey = request.PrivateKey == null? DefaultPrivateKey : request.PrivateKey ,
                    PrivateKeyPass = request.PrivateKeyPass == null? DefaultPrivateKeyPass : request.PrivateKeyPass,
                    CurrencyId = request.CurrencyId,
                    CountryCode = request.CountryCode,
                    Environment = request.Environment,
                    UseDefaultPartner = request.UseDefaultPartner
            });
            }
            if (request.Roles != null)
            { 
                if (request.Roles.Count > 0)
                {
                        foreach (var role in request.Roles)
                        {
                            await AircashSimulatorContext.PartnerRoles.AddAsync(new PartnerRoleEntity
                            {
                                PartnerId = id,
                                PartnerRole = role
                            });
                        }
                }
            }

            if (request.Username != null) 
            {
                await SaveUser(request.Username, id);
            }
            await AircashSimulatorContext.SaveChangesAsync();
        }

        public async Task DeletePartner(PartnerDetailVM Partner)
        {
            var partner = await AircashSimulatorContext.Partners.FirstOrDefaultAsync(x => x.PartnerId == Partner.PartnerId);
            AircashSimulatorContext.Partners.Remove(partner);

            var roles = await AircashSimulatorContext.PartnerRoles.Where(x => x.PartnerId == Partner.PartnerId).ToListAsync();
            if(roles != null)
            {
                foreach (var role in roles)
                {
                    AircashSimulatorContext.PartnerRoles.Remove(role);
                }
            }
            var findAllUsers = await AircashSimulatorContext.Users.Where(x => x.PartnerId == Partner.PartnerId).ToListAsync();
            foreach (var user in findAllUsers)
            {
                await UserService.DeleteUser(user.UserId);
            }
            await AircashSimulatorContext.SaveChangesAsync();
        }
       
        public async Task SaveUser(string username, Guid partnerId) {
            string hash = "";
            using (SHA256 sha256Hash = SHA256.Create())
            {
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(username));
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                hash = builder.ToString();
            }

            if ((await AircashSimulatorContext.Users.Where(x => x.Username == username).ToListAsync()).Count() > 0)
                throw new SimulatorException(SimulatorExceptionErrorEnum.UsernameNotFound, "Username already taken.");

            await AircashSimulatorContext.Users.AddAsync(new UserEntity
            {
                UserId = Guid.NewGuid(),
                Username = username,
                Email = username,
                PartnerId = partnerId,
                PasswordHash = hash,
                Environment = EnvironmentEnum.Staging
            });
        }

    }
}
