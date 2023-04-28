using Domain.Entities.Enum;
using System;
using System.Threading.Tasks;

namespace Services.AbonOnlinePartner
{
    public interface IAbonOnlinePartnerService
    {
        Task<object> ValidateCoupon(string CouponCode, Guid partnerId, string partnerPrivateKey, string partnerPrivateKeyPass);
        AbonValidateCouponRequest GetValidateCouponRequest(string CouponCode, Guid partnerId, string partnerPrivateKey, string partnerPrivateKeyPass);
        string GetValidateCouponEndpoint();
        Task<object> ConfirmTransaction(string CouponCode, Guid UserId, Guid partnerId, string partnerPrivateKey, string partnerPrivateKeyPass);
        AbonConfirmTransactionRequest GetConfirmTransactionRequest(string CouponCode, Guid UserId, Guid partnerId, string partnerPrivateKey, string partnerPrivateKeyPass);
        string GetConfirmTransactionEndpoint();
    }
}
