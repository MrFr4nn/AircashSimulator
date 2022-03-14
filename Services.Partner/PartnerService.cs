using DataAccess;
using Domain.Entities;
using Domain.Entities.Enum;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Services.Partner
{
    public class PartnerService : IPartnerService
    {
        private AircashSimulatorContext AircashSimulatorContext;

        public PartnerService(AircashSimulatorContext aircashSimulatorContext)
        {
            AircashSimulatorContext = aircashSimulatorContext;
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

        public async Task<PartnerDetailVM> GetPartnerDetails(Guid partnerId)
        {
            var partner = await AircashSimulatorContext.Partners.FirstOrDefaultAsync(x => x.PartnerId == partnerId);
            var roles = await AircashSimulatorContext.PartnerRoles
                .Where(x => x.PartnerId == partnerId)
                .Select(x => new Role
                {
                    RoleId = x.PartnerRole,
                    RoleName = x.PartnerRole.ToString()
                }).ToListAsync();

            var partnerDetails = new PartnerDetailVM
            {
                PartnerId = partner.PartnerId,
                PartnerName = partner.PartnerName,
                PrivateKey = partner.PrivateKey,
                PrivateKeyPass = partner.PrivateKeyPass,
                CurrencyId = partner.CurrencyId,
                CountryCode = partner.CountryCode,
                Environment = partner.Environment,
                Roles = roles
            };

            return partnerDetails;
        }

        public async Task SavePartner(PartnerDetailVM request)
        {
            Guid id;
            if (request.PartnerId != null)
            {
                var partner = await AircashSimulatorContext.Partners.FirstOrDefaultAsync(x => x.PartnerId == request.PartnerId);
                id = partner.PartnerId;
                partner.PartnerName = request.PartnerName;
                partner.PrivateKey = request.PrivateKey;
                partner.PrivateKeyPass = request.PrivateKeyPass;
                partner.CurrencyId = request.CurrencyId;
                partner.CountryCode = request.CountryCode;
                partner.Environment = request.Environment;

                var roles = await AircashSimulatorContext.PartnerRoles.Where(x => x.PartnerId == request.PartnerId).ToListAsync();
                foreach (var role in roles)
                    AircashSimulatorContext.PartnerRoles.Remove(role);

                AircashSimulatorContext.Partners.Update(partner);
            }
            else
            {
                id = Guid.NewGuid();
                await AircashSimulatorContext.Partners.AddAsync(new PartnerEntity
                {
                    PartnerId = id,
                    PartnerName = request.PartnerName,
                    PrivateKey = request.PrivateKey,
                    PrivateKeyPass = request.PrivateKeyPass,
                    CurrencyId = request.CurrencyId,
                    CountryCode = request.CountryCode,
                    Environment = request.Environment
                });
            }

            if (request.Roles.Count > 0)
            {
                foreach (var role in request.Roles)
                {
                    await AircashSimulatorContext.PartnerRoles.AddAsync(new PartnerRoleEntity
                    {
                        PartnerId = id,
                        PartnerRole = role.RoleId
                    });
                }
            }

            await AircashSimulatorContext.SaveChangesAsync();
        }
    }
}
