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

            return partnerRoles;
        }

        public async Task SaveRoles(PartnerDetailVM request)
        {
            var roles = await AircashSimulatorContext.PartnerRoles.Where(x => x.PartnerId == request.PartnerId).ToListAsync();

            foreach (var role in roles)
                AircashSimulatorContext.PartnerRoles.Remove(role);

            if (request.Roles.Count > 0)
            {
                foreach (var role in request.Roles)
                {
                    AircashSimulatorContext.PartnerRoles.Add(new PartnerRoleEntity
                    {
                        PartnerId = request.PartnerId,
                        PartnerRole = role.RoleId
                    });
                }
            }
            AircashSimulatorContext.SaveChanges();
        }
    }
}
