using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashInAppPay
{
    public interface IAircashInAppPayService
    {
        Task<object> GenerateTransaction(GenerateTransactionRequest generateTransactionRequest);
        Task<object> RefundTransaction(RefundTransactionRequest refundTransactionRequest);
    }
}
