using Domain.Entities.Enum;
using DataAccess;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Services.Transaction
{
    public class TransactionService : ITransactionService
    {
        private AircashSimulatorContext AircashSimulatorContext;
        public TransactionService(AircashSimulatorContext aircashSimulatorContext)
        {
            AircashSimulatorContext = aircashSimulatorContext;
        } 

        public async Task<object> GetTransactions(Guid partnerId, int transactionAmount)
        {
            var listOfTransactions = AircashSimulatorContext.Transactions.AsNoTracking().Where(x => x.PartnerId == partnerId && x.ServiceId == ServiceEnum.AircashPay)
                                                                                        .Take(transactionAmount)
                                                                                        .OrderBy(x => x.ResponseDateTimeUTC)
                                                                                        .ToList();
            List<TransactionDTO> transactionDTOs = new List<TransactionDTO>();
            foreach (var transaction in listOfTransactions)
            {
                var preparedTransaction = await AircashSimulatorContext.PreparedAircashTransactions.FirstAsync(x => x.PartnerTransactionId == transaction.TransactionId);
                var transactionDTO = new TransactionDTO
                {
                    TransactionId = transaction.TransactionId,
                    Description = preparedTransaction.Description,
                    Location = preparedTransaction.LocationId,
                    RequestTime = preparedTransaction.RequestDateTimeUTC
                };
                transactionDTOs.Add(transactionDTO);
            }
            return transactionDTOs;
        }
    }
}
