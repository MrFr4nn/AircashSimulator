using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Settings
{
    public interface ISettingsService
    {
        Task RefreshSettings();
        Dictionary<string, string> GetSettings();
        string AircashSimulatorPrivateKeyPath { get; }
        string PrivateKeyForInvalidSignature { get; }
        string AircashSimulatorPrivateKeyPass { get; }
        string UsedCuponCodeForSimulatingError { get; }
        string ValidCuponCodeForSimulatingError { get; }
        string SixteenDigitCodeBA { get; }
        string SalesPartnerLocation { get; }
        string ValidBarcode { get; }
        string UsedBarcode { get; }
        string BarcodeOverLimit { get; }
        string NotCheckedBarcode { get; }
        Guid AbonOnlinePartnerId { get; }
        Guid BlockedUserId { get; }
        Guid SalesPartnerId { get; }
        Guid PartnerTransactionIdAlreadyExists { get; }
        Guid UnableToCancelPayoutTransactionId { get; }
        Guid TransactionAlreadyCanceledId { get; }
    }
}
