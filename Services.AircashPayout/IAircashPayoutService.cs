using Domain.Entities.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashPayout
{
    public interface IAircashPayoutService
    {
        Task<object> CheckUser(string phoneNumber, string partnerUserId, Guid partnerId);
        Task<object> CreatePayout(string phoneNumber, Guid partnerTransactionId, decimal amount, CurrencyEnum currency, Guid partnerUserId, Guid partnerId);
        Task<object> CheckTransactionStatus(Guid partnerTransactionId);
    }
}
