using Domain.Entities.Enum;
using System;
using System.Threading.Tasks;

namespace Services.AbonOnlinePartner
{
    public interface IAbonOnlinePartnerService
    {
        Task<object> ValidateCoupon(string CouponCode, Guid partnerId, string partnerPrivateKey, string partnerPrivateKeyPass, EnvironmentEnum environment);
        AbonValidateCouponRequest GetValidateCouponRequest(string CouponCode, Guid partnerId, string partnerPrivateKey, string partnerPrivateKeyPass);
        string GetValidateCouponEndpoint(EnvironmentEnum environment);
        Task<object> ConfirmTransaction(string CouponCode, Guid UserId, Guid partnerId, string partnerPrivateKey, string partnerPrivateKeyPass,EnvironmentEnum environment);
        AbonConfirmTransactionRequest GetConfirmTransactionRequest(string CouponCode, Guid UserId, Guid partnerId, string partnerPrivateKey, string partnerPrivateKeyPass);
        string GetConfirmTransactionEndpoint(EnvironmentEnum environment);
    }
}
