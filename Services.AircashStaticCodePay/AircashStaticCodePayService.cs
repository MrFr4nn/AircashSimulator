using System;
using DataAccess;
using System.Linq;
using Domain.Entities;
using Domain.Entities.Enum;
using System.Threading.Tasks;
using AircashSimulator.Configuration;
using Microsoft.Extensions.Logging;
using Services.HttpRequest;
using Microsoft.Extensions.Options;

namespace Services.AircashStaticCodePay
{
    public class AircashStaticCodePayService : IAircashStaticCodePayService
    {
        private AircashSimulatorContext AircashSimulatorContext;
        public AircashStaticCodePayService(AircashSimulatorContext aircashSimulatorContext)
        {
            AircashSimulatorContext = aircashSimulatorContext;
           
        }
        public async Task<object> ConfirmTransaction(TransactionDTO transactionDTO)
        {
            AircashSimulatorContext.Transactions.Add(new TransactionEntity
            {
                Amount = transactionDTO.Amount,
                ISOCurrencyId = transactionDTO.ISOCurrencyId,
                PartnerId = transactionDTO.PartnerId,
                AircashTransactionId = transactionDTO.AircashTransactionId,
                TransactionId = transactionDTO.PartnerTransactionId,
                ServiceId = ServiceEnum.AircashPay,
                RequestDateTimeUTC = DateTime.Today,
                ResponseDateTimeUTC = DateTime.Now,
                UserId = Guid.NewGuid()
            });
            await AircashSimulatorContext.SaveChangesAsync();
            return new ConfirmResponse { ResponseCode = 1 };  
        }
    }
}
