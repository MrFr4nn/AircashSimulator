using System.Threading.Tasks;

namespace Services.AircashStaticCodePay
{
    public interface IAircashStaticCodePayService
    {
        Task<object> ConfirmTransaction(TransactionDTO transactionDTO);
    }
}
