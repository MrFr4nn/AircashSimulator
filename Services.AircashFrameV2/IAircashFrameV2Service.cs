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
        public Task<object> Initiate(InititateRequestV2Dto initiateRequestDTO, string partnerTransactionId, CurrencyEnum currency, EnvironmentEnum environment);
        public Task<ResponseAircashFrameV2Url> InitiateCashierFrameV2(InititateRequestV2Dto initiateRequestDTO, EnvironmentEnum environment);
        public Task NotificationCashierFrameV2(string transactionId);
        Task<object> CheckTransactionStatusFrame(Guid partnerId, string transactionId, EnvironmentEnum environment);
        Task<object> CheckTransactionStatusV2Frame(Guid partnerId, string transactionId, EnvironmentEnum environment);
        Task<object> CheckTransactionStatusV3Frame(Guid partnerId, string transactionId, EnvironmentEnum environment);
        Task<object> ConfirmPayout(Guid partnerId, string transactionId, decimal amount, CurrencyEnum currency, EnvironmentEnum environment);
        ConfirmPayoutRequest GetConfirmPayoutRequest(Guid partnerId, string transactionId, decimal amount, CurrencyEnum currency);
        public Task<AircashTransactionStatusResponseV2> CheckTransactionStatusCashierFrameV2(Guid partnerId, string transactionId);
        AircashTransactionStatusRequestV2 GetCheckTransactionStatusFrameRequest(Guid partnerId, string transactionId);
        string GetCheckTransactionStatusEndpoint(EnvironmentEnum environment);
        string GetCheckTransactionStatusV2Endpoint(EnvironmentEnum environment);
        string GetCheckTransactionStatusV3Endpoint(EnvironmentEnum environment);
        string GetConfirmPayoutEndpoint(EnvironmentEnum environment);
        Task<Response> RefundTransaction(AircashRefundTransactionRequestV2 request);
        Task<object> CancelPayout(Guid partnerId, string transactionId, EnvironmentEnum environment);
        CancelPayoutRequest GetCancelPayoutRequest(Guid partnerId, string transactionId);
        string GetCancelPayoutEndpoint(EnvironmentEnum environment);
    }
}
