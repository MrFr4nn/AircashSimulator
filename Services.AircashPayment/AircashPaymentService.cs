using DataAccess;
using System.Threading.Tasks;
using Domain.Entities;
using System;
using Domain.Entities.Enum;

namespace Services.AircashPayment
{
    public class AircashPaymentService : IAircashPaymentService
    {
        private AircashSimulatorContext AircashSimulatorContext;

        public AircashPaymentService(AircashSimulatorContext aircashSimulatorContext)
        {
            AircashSimulatorContext = aircashSimulatorContext;
        }

        public async Task<object> CreateAndConfirmPayment(TransactionPayment transaction)
        {
            AircashSimulatorContext.Transactions.Add(new TransactionEntity 
            {
                Amount = transaction.Amount,
                TransactionId = transaction.TransactionId,
                PartnerId = Guid.NewGuid(),
                UserId = Guid.NewGuid(),
                AircashTransactionId = Guid.NewGuid().ToString(),
                ServiceId = ServiceEnum.AircashPayment,
                RequestDateTimeUTC = DateTime.Today,
                ResponseDateTimeUTC = DateTime.Now,
            });
            await AircashSimulatorContext.SaveChangesAsync()
            
           
        }


    }
}
