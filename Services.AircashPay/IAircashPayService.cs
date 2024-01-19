using Domain.Entities.Enum;
using System;
using System.Threading.Tasks;

namespace Services.AircashPay
{
    public interface IAircashPayService
    {
        Task<object> GeneratePartnerCode(GeneratePartnerCodeDTO generatePartnerCodeDTO, EnvironmentEnum environment);
        Task<object> ConfirmTransaction(TransactionDTO transactionDTO);
        Task<object> CancelTransaction(CancelTransactionDTO cancelTransactionDTO, EnvironmentEnum environment);
        Task<object> RefundTransaction(RefundTransactionDTO refundTransactionDTO, EnvironmentEnum environment);
        Task<string> GeneratePartnerCodeCashRegister(GeneratePartnerCodeDTO generatePartnerCodeDTO, EnvironmentEnum environment);
    }
}
