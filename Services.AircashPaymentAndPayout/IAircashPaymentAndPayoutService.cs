using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashPaymentAndPayout
{
    public interface IAircashPaymentAndPayoutService
    {
        Task<object> CheckCode(string barCode, string locationID, Guid partnerId);
        Task<object> ConfirmTransaction(string barCode, string locationID, Guid partnerId, Guid userId);
        Task<object> CheckTransactionStatus(string partnerTransactionID, Guid partnerId);
        Task<object> CancelTransaction(string partnerTransactionID, string locationID, Guid partnerId, Guid userId);
    }
}
