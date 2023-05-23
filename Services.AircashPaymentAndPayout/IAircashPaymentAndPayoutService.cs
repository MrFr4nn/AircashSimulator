using Domain.Entities.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashPaymentAndPayout
{
    public interface IAircashPaymentAndPayoutService
    {
        Task<object> CheckCode(string barCode, string locationID, Guid partnerId, EnvironmentEnum environment);
        Task<object> ConfirmTransaction(string barCode, string locationID, Guid partnerId, Guid userId, Guid partnerTransactionID, EnvironmentEnum environment);
        Task<object> CheckTransactionStatus(string partnerTransactionID, Guid partnerId, EnvironmentEnum environment);
        Task<object> CancelTransaction(string partnerTransactionID, string locationID, Guid partnerId, Guid userId, EnvironmentEnum environment);
    }
}
