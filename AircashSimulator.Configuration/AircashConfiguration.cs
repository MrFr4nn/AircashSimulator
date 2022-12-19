using System;
using System.Collections.Generic;
using System.Text;

namespace AircashSimulator.Configuration
{
    public class AircashConfiguration
    {
        public string RefundTransactionEndpoint { get; set; }
        public string M3StagingBaseUrl { get; set; }
        public string M3DevBaseUrl { get; set; }
        public string M2StagingBaseUrl { get; set; }
        public string M2DevBaseUrl { get; set; }
        public string GeneratePartnerCodeEndpoint { get; set; }
        public string CheckUserEndpoint { get; set; }
        public string CreatePayoutEndpoint { get; set; }
        public string CheckTransactionStatusEndpoint { get; set; }
        public string CancelTransactionEndpoint { get; set; }
        public string ValidForPeriod { get; set; }
        public string AcPayPublicKey { get; set; }
        public string AcFramePublicKey { get; set; }
        public string AcPaymentPublicKey { get; set; }
        public int TransactionAmountPerPage { get; set; }
        public string CheckCodeEndpoint { get; set; }
        public string ConfirmTransactionEndpoint { get; set; }
        public string PaymentCheckTransactionStatusEndpoint { get; set; }
        public string PaymentCancelTransactionEndpoint { get; set; }
        public string AircashFrameTestUrl { get; set; }
        public string AircashFrameProductionUrl { get; set; }
        public string InitiateEndpoint { get; set; }
        public string TransactionStatusEndpoint { get; set; }
        public string NotificationUrl { get; set; }
        public string SuccessUrl { get; set; }
        public string DeclineUrl { get; set; }
        public string CheckTicketEndpoint { get; set; }
        public string RedeemTicketEndpoint { get; set; }
        public string AircashFrameBaseUrl { get; set; }
        public string AircashCheckUserV4Endpoint { get; set; }
        public string AircashCreatePayoutV4Endpoint { get; set;  }
        public string MatchCompareIdentity { get; set;  }
    }
}
