using Domain.Entities;
using Domain.Entities.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AircashFrameV2
{
    public interface IAircashFrameV2Service
    {
        public Task<object> Initiate(InititateRequestV2Dto initiateRequestDTO, Guid partnerTransactionId, CurrencyEnum currency);
        public Task<ResponseAircashFrameV2Url> InitiateCashierFrameV2(InititateRequestV2Dto initiateRequestDTO);
        public Task NotificationCashierFrameV2(Guid transactionId);
        Task<object> CheckTransactionStatusFrame(Guid userId,Guid partnerId, string transactionId);
        public Task<AircashTransactionStatusResponseV2> CheckTransactionStatusCashierFrameV2(PartnerEntity partner, string transactionId);
    }
}
