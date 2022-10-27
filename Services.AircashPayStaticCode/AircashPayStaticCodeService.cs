using System;
using DataAccess;
using Domain.Entities;
using Domain.Entities.Enum;
using System.Threading.Tasks;

namespace Services.AircashPayStaticCode
{
    public class AircashPayStaticCodeService : IAircashPayStaticCodeService
    {
        private AircashSimulatorContext AircashSimulatorContext;
        public AircashPayStaticCodeService(AircashSimulatorContext aircashSimulatorContext)
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
            return null;
        }
    }
}
