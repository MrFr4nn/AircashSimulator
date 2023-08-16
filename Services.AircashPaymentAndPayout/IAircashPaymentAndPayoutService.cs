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
        Task<object> CheckCodeV2(string barCode, string locationID, Guid partnerId, EnvironmentEnum environment);
        Task<object> CheckDigitsV2(string digitCode, string locationID, string partnerID, int currencyID, EnvironmentEnum environment);
        Task<object> ConfirmTransaction(string barCode, string locationID, Guid partnerId, string userId, string partnerTransactionID, EnvironmentEnum environment);
        Task<object> CheckTransactionStatus(string partnerTransactionID, Guid partnerId, EnvironmentEnum environment);
        Task<object> CancelTransaction(string partnerTransactionID, string locationID, Guid partnerId, string userId, EnvironmentEnum environment);
    }
}
