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
        Task<object> CheckUser(string phoneNumber, string partnerUserId, Guid partnerId, EnvironmentEnum environment);
        Task<object> CheckUserV4(string phoneNumber, string partnerUserId, Guid partnerId, List<Parameter> parameters, EnvironmentEnum environment);
        AircashCheckUserRequest GetCheckUserRequest(string phoneNumber, string partnerUserId, Guid partnerId);
        string GetCheckUserEndpoint(EnvironmentEnum environment);
        Task<object> CreatePayout(string phoneNumber, Guid partnerTransactionId, decimal amount, CurrencyEnum currency, Guid partnerUserId, Guid partnerId, EnvironmentEnum environment);
        Task<object> CreatePayoutV4(string phoneNumber, Guid partnerTransactionId, decimal amount, CurrencyEnum currency, Guid partnerUserId, Guid partnerId, List<Parameter> parameters, EnvironmentEnum environment);
        AircashCreatePayoutRequest GetCreatePayoutRequest(string phoneNumber, decimal amount, Guid partnerUserId, Guid partnerId);
        string GetCreatePayoutEndpoint(EnvironmentEnum environment);
        Task<object> CheckTransactionStatus(Guid partnerTransactionId, EnvironmentEnum environment);
        AircashCheckTransactionStatusRequest GetCheckTransactionStatusRequest(Guid partnerTransactionId);
        string GetCheckTransactionStatusEndpoint(EnvironmentEnum environment);
    }
}
