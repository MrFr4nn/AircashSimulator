using Domain.Entities;
using Domain.Entities.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;

namespace Services.AircashFrameV2
{
    public interface IAircashFrameV2Service
    {
        public Task<object> Initiate(InititateRequestV2Dto initiateRequestDTO, Guid partnerTransactionId, CurrencyEnum currency, EnvironmentEnum environment);
        public Task<ResponseAircashFrameV2Url> InitiateCashierFrameV2(InititateRequestV2Dto initiateRequestDTO, EnvironmentEnum environment);
        public Task NotificationCashierFrameV2(Guid transactionId);
        Task<object> CheckTransactionStatusFrame(Guid partnerId, string transactionId, EnvironmentEnum environment);
        Task<object> ConfirmPayout(Guid partnerId, string transactionId, decimal amount, CurrencyEnum currency, EnvironmentEnum environment);
        public Task<AircashTransactionStatusResponseV2> CheckTransactionStatusCashierFrameV2(PartnerEntity partner, string transactionId);
        AircashTransactionStatusRequestV2 GetCheckTransactionStatusFrameRequest(Guid partnerId, string transactionId);
        string GetCheckTransactionStatusEndpoint(EnvironmentEnum environment);
    }
}
