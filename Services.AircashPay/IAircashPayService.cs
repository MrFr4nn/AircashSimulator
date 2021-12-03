using Domain.Entities.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashPay
{
    public interface IAircashPayService
    {
        Task<object> GeneratePartnerCode(string PartnerId, decimal Amount, string ISOCurrencyId, string Description, int ValidForPeriod, string LocationId);
    }
}
