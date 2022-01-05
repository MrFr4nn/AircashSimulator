using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.PartnerAbonDenominations
{
    public interface IPartnerAbonDenominationService
    {
        Task<List<decimal>> GetDenominations(Guid partnerId);
    }
}
