using Domain.Entities.Enum;
using System;
using System.Threading.Tasks;

namespace Services.AbonOnlinePartner
{
    public interface IAbonOnlinePartnerService
    {
        Task<object> ValidateCoupon(string CouponCode, string partnerId, string partnerPrivateKey, string partnerPrivateKeyPass, EnvironmentEnum environment);
        Task<object> ConfirmTransaction(string CouponCode, string providerId, string providerTransactionId, string userId, string partnerPrivateKey, string partnerPrivateKeyPass, EnvironmentEnum environment);
    }
}
