using Domain.Entities.Enum;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Services.AbonSalePartner
{
    public interface IAbonSalePartnerService
    {
        Task<object> CreateCoupon(decimal value, string pointOfSaleId, Guid partnerId, string isoCurrencySymbol, Guid partnerTransactionId, string privateKeyPath, string privateKeyPass, EnvironmentEnum environment);
        Task<object> CancelCoupon(string serialNumber, string pointOfSaleId, Guid partnerId, string privateKeyPath, string privateKeyPass, EnvironmentEnum environment);
    }
}
