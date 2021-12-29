using DataAccess;
using Domain.Entities.Enum;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Services.Transactions
{
    public class TransactionService : ITransactionService
    {
        private AircashSimulatorContext AircashSimulatorContext;
        public TransactionService(AircashSimulatorContext aircashSimulatorContext)
        {
            AircashSimulatorContext = aircashSimulatorContext;
        }

        public async Task<List<Transaction>> GetTransactions(Guid partnerId, int pageSize, int pageNumber, List<ServiceEnum> services)
        {
            var transactions = await AircashSimulatorContext.Transactions
                .Where(x => x.PartnerId == partnerId && services.Contains(x.ServiceId))
                .OrderByDescending(x => x.RequestDateTimeUTC)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(x => new Transaction 
                {
                    Id = x.Id,
                    Amount = x.Amount,
                    ISOCurrencyId = x.ISOCurrencyId,
                    PartnerId = x.PartnerId,
                    AircashTransactionId = x.AircashTransactionId,
                    TransactionId = x.TransactionId,
                    RequestDateTimeUTC = x.RequestDateTimeUTC,
                    ResponseDateTimeUTC = x.ResponseDateTimeUTC,
                    ServiceId = x.ServiceId,
                    UserId = x.UserId,
                    PointOfSaleId = x.PointOfSaleId
                }).ToListAsync();

            return transactions;
        }
    }
}