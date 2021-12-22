using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Transaction
{
    public interface ITransactionService
    {
        Task<object> GetTransactions(Guid partnerId, int transactionAmount);
    }
}
