using Domain.Entities.Enum;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Services.AbonOnlinePartner
{
    public interface IAbonOnlinePartnerService
    {
        Task<object> ValidateCoupon(string couponCode, string providerId, string partnerPrivateKey, string partnerPrivateKeyPass, EnvironmentEnum environment);
        Task<object> CheckStatusCoupon(string partnerId, string couponCode, string partnerTransactionId, string notificationUrl, string userId, string userPhoneNumber, List<AbonCheckStatusCouponParameters> parameters, string partnerPrivateKey, string partnerPrivateKeyPass, EnvironmentEnum environment);        
        AbonValidateCouponRequest GetValidateCouponRequest(string couponCode, string providerId, string partnerPrivateKey, string partnerPrivateKeyPass);
        string GetValidateCouponEndpoint(EnvironmentEnum environment);
        Task<object> ConfirmTransaction(string couponCode, string providerId, string providerTransactionId, string userId, string partnerPrivateKey, string partnerPrivateKeyPass, EnvironmentEnum environment);
        Task<object> ConfirmTransactionV2(string couponCode, string partnerId, string partnerTransactionId, string userId, string partnerPrivateKey, string partnerPrivateKeyPass, EnvironmentEnum environment);
        AbonConfirmTransactionRequest GetConfirmTransactionRequest(string couponCode, string userId, string providerId, string providerTransactionId, string partnerPrivateKey, string partnerPrivateKeyPass);
        string GetConfirmTransactionEndpoint(EnvironmentEnum environment);
    }
}
