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
        string PointOfSaleIdCashier { get; }
        string PointOfSaleId { get; }
        string AbonInvalidCurrencySymbol { get; }
        decimal AbonDefaultValue { get; }
        decimal AbonInvalidValue { get; }
        Guid AbonOnlinePartnerId { get; }
        Guid AbonGeneratePartnerId { get; }
        Guid BlockedUserId { get; }
    }
}
