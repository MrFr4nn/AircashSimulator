using Domain.Entities.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Partner
{
    public class PartnerRolesVM
    {
        public Guid PartnerId { get; set; }
        public List<Role> Roles { get; set; }
    }

    public class Role
    {
        public RoleEnum RoleId { get; set; }
        public string RoleName { get; set; }
    }
}
