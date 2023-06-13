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
        AircashCheckUserV4Request GetCheckUserV4Request(string phoneNumber, string partnerUserId, Guid partnerId, List<Parameter> parameters);
        Task<object> CreatePayout(string phoneNumber, Guid partnerTransactionId, decimal amount, CurrencyEnum currency, Guid partnerUserId, Guid partnerId, EnvironmentEnum environment);
        Task<object> CreatePayoutV4(string phoneNumber, Guid partnerTransactionId, decimal amount, CurrencyEnum currency, Guid partnerUserId, Guid partnerId, List<Parameter> parameters, EnvironmentEnum environment);
        AircashCreatePayoutRequest GetCreatePayoutRequest(string phoneNumber, Guid partnerTransactionId, decimal amount, CurrencyEnum currency, Guid partnerUserId, Guid partnerId);
        AircashCreatePayoutV4Request GetCreatePayoutV4Request(string phoneNumber, Guid partnerTransactionId, decimal amount, CurrencyEnum currency, Guid partnerUserId, Guid partnerId, List<Parameter> parameters);
        Task<object> CheckTransactionStatus(Guid partnerId, Guid partnerTransactionId, Guid aircashTransactionId, EnvironmentEnum environment);
        AircashCheckTransactionStatusRequest GetCheckTransactionStatusRequest(Guid partnerId, Guid partnerTransactionId, Guid aircashTransactionId);
        string GetCheckTransactionStatusEndpoint(EnvironmentEnum environment);
        string GetCheckUserEndpoint(EnvironmentEnum environment);
        string GetCheckUserV4Endpoint(EnvironmentEnum environment);
        string GetCreatePayoutEndpoint(EnvironmentEnum environment);
        string GetCreatePayoutV4Endpoint(EnvironmentEnum environment);
    }
}
