using System;
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
        List<Role> GetRolesNewPartner(string roleId);
        Task<List<PartnerDetailVM>> GetPartnersDetail(int pageSize,int pageNumber, string search);
        Task SavePartner(PartnerDetailVM request);
        Task DeletePartner(PartnerDetailVM Partner);
        Task SaveUser(string username, Guid partnerId);
    }
}
