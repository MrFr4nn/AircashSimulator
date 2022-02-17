using System;
using System.Threading.Tasks;

namespace Services.AbonOnlinePartner
{
    public interface IAbonOnlinePartnerService
    {
        Task<object> ValidateCoupon(string CouponCode, Guid partnerId);
        Task<object> ConfirmTransaction(string CouponCode, Guid UserId, Guid partnerId);
    }
}
