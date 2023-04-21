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
        string AircashSimulatorPrivateKeyPass { get; }
        Guid AbonOnlinePartnerCashierPartnerId { get; }
    }
}
