using DataAccess;
using Domain.Entities;
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

        public async Task<List<Transaction>> GetTransactions(Guid partnerId)
        {
            var listOfTransactions = AircashSimulatorContext.Transactions.ToList();
            List<Transaction> list = new List<Transaction>();

            foreach (var transactionEntity in listOfTransactions)
            {
                var transaction = new Transaction()
                {
                    Id = transactionEntity.Id,
                    Amount = transactionEntity.Amount,
                    ISOCurrencyId = transactionEntity.ISOCurrencyId,
                    PartnerId = transactionEntity.PartnerId,
                    AircashTransactionId = transactionEntity.AircashTransactionId,
                    TransactionId = transactionEntity.TransactionId,
                    RequestDateTimeUTC = transactionEntity.RequestDateTimeUTC,
                    ResponseDateTimeUTC = transactionEntity.ResponseDateTimeUTC,
                    ServiceId = transactionEntity.ServiceId,
                    UserId = transactionEntity.UserId,
                    PointOfSaleId = transactionEntity.PointOfSaleId
                };
                list.Add(transaction);
            }

            return list;
        }
    }
}