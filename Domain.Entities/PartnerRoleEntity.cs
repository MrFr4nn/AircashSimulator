using Domain.Entities.Enum;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities
{
    public class PartnerRoleEntity
    {
        public int Id { get; set; }
        public Guid PartnerId { get; set; }
        public RoleEnum PartnerRole { get; set; }
    }
}
