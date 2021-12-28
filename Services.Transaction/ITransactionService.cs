using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Transactions
{
    public interface ITransactionService
    {
        Task<List<Transaction>> GetTransactions(Guid partnerId, int pageSize, int pageNumber);
        Task<List<PreparedAircashFrameTransaction>> GetAircashFramePreparedTransactions(Guid partnerId, int pageSize, int pageNumber);
    }
}