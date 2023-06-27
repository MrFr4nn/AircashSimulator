using Domain.Entities.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashInAppPay
{
    public interface IAircashInAppPayService
    {
        Task<object> GenerateTransaction(GenerateTransactionRequest generateTransactionRequest, EnvironmentEnum environment);
        Task<object> RefundTransaction(RefundTransactionRequest refundTransactionRequest, EnvironmentEnum environment);
        Task<object> CheckTransactionStatus(Guid partnerId, string partnerTransactionId, EnvironmentEnum environment);
    }
}
