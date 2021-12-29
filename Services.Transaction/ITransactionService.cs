using System;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace Services.Transactions
{
    public interface ITransactionService
    {
        Task<List<Transaction>> GetTransactions(Guid partnerId, int pageSize, int pageNumber);
        Task<List<PreparedAircashFrameTransaction>> GetAircashFramePreparedTransactions(Guid partnerId, int pageSize, int pageNumber);
    }
}