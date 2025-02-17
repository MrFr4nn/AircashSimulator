﻿using System.Threading.Tasks;

namespace Services.AircashPayStaticCode
{
    public interface IAircashPayStaticCodeService
    {
        Task<object> ConfirmTransaction(TransactionDTO transactionDTO);
        Task<object> GenerateQRLink(GenerateQRLinkDTO generateQRLinkDTO);
    }
}
