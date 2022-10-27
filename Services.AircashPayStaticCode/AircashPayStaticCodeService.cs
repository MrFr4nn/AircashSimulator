using System;
using DataAccess;
using Domain.Entities;
using Domain.Entities.Enum;
using System.Threading.Tasks;
using static System.Formats.Asn1.AsnWriter;
using static System.Net.WebRequestMethods;

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

        public async Task<object> GenerateQRLink(GenerateQRLinkDTO generateQRLinkDTO)
        {
            string link = "https://dev-m3.aircash.eu/api/acpay/acpay?type=12&partnerID=0ffe2e26-59bd-4ad4-b0f7-976d333474ca&amt=" + generateQRLinkDTO.Amount +
            "&currencyIsoCode=" + generateQRLinkDTO.Currency + "&locationID=" + generateQRLinkDTO.Location;

            return link;
        }
    }
}
