﻿using System;
using Domain.Entities;
using System.Threading.Tasks;

namespace Services.AircashFrame
{
    public interface IAircashFrameService
    {
        public Task<object> Initiate(InitiateRequestDTO initiateRequestDTO);
        public Task<int> Notification(string transactionId);
        public Task<object> TransactionStatus(Guid partnerId, string transactionId);
        public Task<Response> CheckTransactionStatus(PartnerEntity partner, string transactionId);
        Task<Response> RefundTransaction(AircashRefundTransactionRequest request);

	}
}
