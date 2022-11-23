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
        Task<List<PartnerDetailVM>> GetPartnerDetails();
        Task<List<PartnerDetailVM>> GetPartnersPage(RequestParameter filter);
        Task SavePartner(PartnerDetailVM request);

        Task DeletePartner(PartnerDetailVM Partner);
    }
}
