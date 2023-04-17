using Domain.Entities.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashPayoutV2
{
    public interface IAircashPayoutV2Service
    {
        Task<object> CheckUser(string phoneNumber, string partnerUserId, Guid partnerId, List<Parameters> customParameters);
        Task<object> CreatePayout(Guid partnerId, decimal amount, string phoneNumber, string partnerUserID, List<Parameters> parameters, EnvironmentEnum environment);
        Task<object> CheckCode(Guid partnerId, string barCode, EnvironmentEnum environment);
        Task<object> ConfirmTransaction(string barCode, Guid partnerId, Guid userId, EnvironmentEnum environment);
        Task<object> CheckTransactionStatus(Guid partnerTransactionId);
    }
}
