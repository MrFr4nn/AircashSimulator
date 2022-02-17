using System.Threading.Tasks;

namespace Services.AircashPay
{
    public interface IAircashPayService
    {
        Task<object> GeneratePartnerCode(GeneratePartnerCodeDTO generatePartnerCodeDTO);
        Task<object> ConfirmTransaction(TransactionDTO transactionDTO);
        Task<object> CancelTransaction(CancelTransactionDTO cancelTransactionDTO);
    }
}
