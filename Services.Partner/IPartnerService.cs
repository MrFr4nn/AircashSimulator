﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Partner
{
    public interface IPartnerService
    {
        Task<List<PartnerVM>> GetPartners();
        List<Role> GetRoles();
        Task<PartnerRolesVM> GetPartnerRoles(Guid partnerId);
        Task SaveRoles(PartnerRolesVM request);
    }
}
