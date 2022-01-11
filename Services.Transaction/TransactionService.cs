using System;
using DataAccess;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Domain.Entities.Enum;

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
                })
                .ToListAsync();

            return transactions;
        }

        public async Task<List<PreparedAircashFrameTransaction>> GetAircashFramePreparedTransactions(Guid partnerId, int pageSize, int pageNumber)
        {
            var transactions = await AircashSimulatorContext.PreparedAircashFrameTransactions
                .Where(x => x.PartnerId == partnerId)
                .OrderByDescending(x => x.RequestDateTimeUTC)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(x => new PreparedAircashFrameTransaction
                {
                    Id = x.Id,
                    PartnerTransactionId = x.PartnerTransactionId,
                    PartnerId = x.PartnerId,
                    UserId = x.UserId,
                    Amount = x.Amount,
                    ISOCurrencyId = x.ISOCurrencyId,
                    PayType = x.PayType,
                    PayMethod = x.PayMethod,
                    NotificationUrl = x.NotificationUrl,
                    SuccessUrl = x.SuccessUrl,
                    DeclineUrl = x.DeclineUrl,
                    RequestDateTimeUTC = x.RequestDateTimeUTC,
                    ResponseDateTimeUTC = x.ResponseDateTimeUTC
                })
                .ToListAsync();

            return transactions;
        }

        public async Task<List<PreparedAircashPayTransaction>> GetAircashPayPreparedTransactions(Guid partnerId, int pageSize, int pageNumber)
        {
            var transactions = await AircashSimulatorContext.PreparedAircashPayTransactions
                .Where(x => x.PartnerId == partnerId)
                .OrderByDescending(x => x.RequestDateTimeUTC)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(x => new PreparedAircashPayTransaction
                {
                    Id = x.Id,
                    PartnerId = x.PartnerId,
                    Amount = x.Amount,
                    ISOCurrencyId = x.ISOCurrencyId,
                    PartnerTransactionId = x.PartnerTransactionId,
                    Description = x.Description,
                    ValidForPeriod = x.ValidForPeriod,
                    LocationId = x.LocationId,
                    UserId = x.UserId,
                    Status = x.Status,
                    RequestDateTimeUTC = x.RequestDateTimeUTC,
                    ResponseDateTimeUTC = x.ResponseDateTimeUTC
                })
                .ToListAsync();

            return transactions;
        }
    }
}