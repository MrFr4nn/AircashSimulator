using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Services.AbonSalePartner
{
    public interface IAbonSalePartnerService
    {
        Task<object> CreateCoupon(decimal value, string pointOfSaleId, Guid userId, Guid partnerId, string isoCurrencySymbol, Guid partnerTransactionId, string privateKeyPath, string privateKeyPass);
        Task<object> CancelCoupon(string serialNumber, string pointOfSaleId, Guid userId, Guid partnerId, string privateKeyPath, string privateKeyPass);
    }
}
