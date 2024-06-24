using Domain.Entities.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Partner
{
    public class PartnerDetailVM
    {
        public Guid? PartnerId { get; set; }
        public string PartnerName { get; set; }
        public int CurrencyId { get; set; }
        public string CountryCode { get; set; }
        public EnvironmentEnum Environment { get; set; }
        public List<Role> Roles { get; set; }
        public bool UseDefaultPartner { get; set; }
        public string Username { get; set; }
        public string Brand { get; set; }
        public Guid ProductionPartnerId { get; set; }
    }

    public class Role
    {
        public RoleEnum RoleId { get; set; }
        public string RoleName { get; set; }
    }
}
