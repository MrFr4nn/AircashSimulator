using Domain.Entities.Enum;
using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using Domain.Entities.Enum;

namespace Services.Transactions
{
    public interface ITransactionService
    {
        Task<List<Transaction>> GetTransactions(Guid partnerId, int pageSize, int pageNumber, List<ServiceEnum> services);
        Task<List<PreparedAircashFrameTransaction>> GetAircashFramePreparedTransactions(Guid partnerId, int pageSize, int pageNumber);
    }
}