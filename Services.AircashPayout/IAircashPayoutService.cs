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
        AircashCheckUserRequest GetCheckUserRequest(string phoneNumber, string partnerUserId, Guid partnerId);
        string GetCheckUserEndpoint(Guid partnerId);
        Task<object> CreatePayout(string phoneNumber, decimal amount, Guid partnerUserId, Guid partnerId);
        AircashCreatePayoutRequest GetCreatePayoutRequest(string phoneNumber, decimal amount, Guid partnerUserId, Guid partnerId);
        string GetCreatePayoutEndpoint(Guid partnerId);
        Task<object> CheckTransactionStatus(Guid partnerTransactionId);
        AircashCheckTransactionStatusRequest GetCheckTransactionStatusRequest(Guid partnerTransactionId);
        string GetCheckTransactionStatusEndpoint(Guid partnerTransactionId);
    }
}
