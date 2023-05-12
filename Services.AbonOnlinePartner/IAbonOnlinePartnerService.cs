using Domain.Entities.Enum;
using System;
using System.Threading.Tasks;

namespace Services.AbonOnlinePartner
{
    public interface IAbonOnlinePartnerService
    {
        Task<object> ValidateCoupon(string CouponCode, string partnerId, string partnerPrivateKey, string partnerPrivateKeyPass);
        Task<object> ConfirmTransaction(string CouponCode, string partnerId, string partnerTransactionId, string userId, string partnerPrivateKey, string partnerPrivateKeyPass);
    }
}
