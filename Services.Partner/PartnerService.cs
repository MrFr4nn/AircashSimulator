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
                        Roles = null
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
            if (request.Roles != null)
            { 
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
            await AircashSimulatorContext.SaveChangesAsync();
        }

    }
}
