using Domain.Entities.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Partner
{
    public class SavePartnerVM
    {
        public Guid? PartnerId { get; set; }
        public string PartnerName { get; set; }
        public string PrivateKey { get; set; }
        public string PrivateKeyPass { get; set; }
        public int CurrencyId { get; set; }
        public string CountryCode { get; set; }
        public EnvironmentEnum Environment { get; set; }
        public List<RoleEnum> Roles { get; set; }
        public bool UseDefaultPartner { get; set; }
        public string? Username { get; set; }
    }
}
