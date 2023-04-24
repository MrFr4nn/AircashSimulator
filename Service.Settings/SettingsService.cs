using DataAccess;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Settings
{
    public class SettingsService : ISettingsService
    {
        const string settingServiceCacheKey = "settingServiceCacheKey";
        private AircashSimulatorContext AircashSimulatorContext;
        private readonly IMemoryCache MemoryCache;

        const decimal defualtTransactionMatchAutoRefundAmountInEur = 67;

        public string AircashSimulatorPrivateKeyPath { get { return GetSetting("AircashSimulatorPrivateKeyPath", string.Empty, throwExceptionIfMissing: true); } }
        public string PrivateKeyForInvalidSignature { get { return GetSetting("PrivateKeyForInvalidSignature", string.Empty, throwExceptionIfMissing: true); } }
        public string AircashSimulatorPrivateKeyPass { get { return GetSetting("AircashSimulatorPrivateKeyPass", string.Empty, throwExceptionIfMissing: true); } }
        public string UsedCuponCodeForSimulatingError { get { return GetSetting("UsedCuponCodeForSimulatingError", string.Empty, throwExceptionIfMissing: true); } }
        public string ValidCuponCodeForSimulatingError { get { return GetSetting("ValidCuponCodeForSimulatingError", string.Empty, throwExceptionIfMissing: true); } }
        public string SixteenDigitCodeBA { get { return GetSetting("SixteenDigitCodeBA", string.Empty, throwExceptionIfMissing: true); } }
        public decimal DefaultAmount { get { return GetSetting("DefaultAmount", decimal.MinusOne, throwExceptionIfMissing: true); } }
        public decimal AmountTooSmall { get { return GetSetting("AmountTooSmall", decimal.MinusOne, throwExceptionIfMissing: true); } }
        public decimal AmountTooBig { get { return GetSetting("AmountTooBig", decimal.MinusOne, throwExceptionIfMissing: true); } }
        public Guid AbonOnlinePartnerId { get { return GetSetting("AbonOnlinePartnerId", Guid.Empty, throwExceptionIfMissing: true); } }
        public Guid AircashPayoutPartnerId { get { return GetSetting("AircashPayoutPartnerId", Guid.Empty, throwExceptionIfMissing: true); } }
        public Guid PartnerTransactionIdAlreadyExists { get { return GetSetting("PartnerTransactionIdAlreadyExists", Guid.Empty, throwExceptionIfMissing: true); } }
        public Guid BlockedUserId { get { return GetSetting("BlockedUserId", Guid.Empty, throwExceptionIfMissing: true); } }

        public SettingsService(AircashSimulatorContext aircashSimulatorContext, IMemoryCache memoryCache)
        {
            AircashSimulatorContext = aircashSimulatorContext;
            MemoryCache = memoryCache;
        }

        T GetSetting<T>(string key, T defaultValue, bool throwExceptionIfMissing = false)
        {
            var dictSettings = GetSettings();
            if (!dictSettings.TryGetValue(key, out string strValue))
            {
                if (throwExceptionIfMissing)
                    throw new ArgumentException($"Unable to find setting with key {key}");
                return defaultValue;
            }

            var type = typeof(T);

            if (type == typeof(int))
            {
                if (!int.TryParse(strValue, out int value))
                    return defaultValue;
                else
                    return (T)Convert.ChangeType(value, type);
            }
            else if (type == typeof(bool))
                return (T)Convert.ChangeType(strValue == "1", type);
            else if (type == typeof(string))
                return (T)Convert.ChangeType(strValue, type);
            else if (type == typeof(Guid))
            {
                if (Guid.TryParse(strValue, out Guid guidValue))
                    return (T)Convert.ChangeType(guidValue, type);
                else
                    return defaultValue;
            }
            else if (type == typeof(List<string>))
                return (T)Convert.ChangeType(new List<string>(strValue.Split(new char[] { ';', ',' }, StringSplitOptions.RemoveEmptyEntries)), type);
            else if (type == typeof(List<int>))
                return (T)Convert.ChangeType(JsonConvert.DeserializeObject<List<int>>(strValue), type);
            else if (type == typeof(Dictionary<int, string>))
                return (T)Convert.ChangeType(JsonConvert.DeserializeObject<Dictionary<int, string>>(strValue), type);
            else if (type == typeof(HashSet<string>))
                return (T)Convert.ChangeType(new HashSet<string>(strValue.Split(new char[] { ';', ',' }, StringSplitOptions.RemoveEmptyEntries)), type);
            else if (type == typeof(HashSet<int>))
                return (T)Convert.ChangeType(JsonConvert.DeserializeObject<HashSet<int>>(strValue), type);
            else if (type == typeof(double))
            {
                if (!double.TryParse(strValue, NumberStyles.Any, CultureInfo.InvariantCulture, out double value))
                    return defaultValue;
                else
                    return (T)Convert.ChangeType(value, type);
            }
            else if (type == typeof(decimal))
            {
                if (!decimal.TryParse(strValue, NumberStyles.Any, CultureInfo.InvariantCulture, out decimal value))
                    return defaultValue;
                else
                    return (T)Convert.ChangeType(value, type);
            }
            else if (type == typeof(DateTime))
            {
                if (!DateTime.TryParse(strValue, out DateTime dateTime))
                    return defaultValue;
                else
                    return (T)Convert.ChangeType(dateTime, type);
            }
           
            else
                throw new Exception($"Unknown type {type}");
        }

        public Dictionary<string, string> GetSettings()
        {
            if (!MemoryCache.TryGetValue(settingServiceCacheKey, out Dictionary<string, string> dictSettings))
            {
                dictSettings = AircashSimulatorContext.Settings.ToDictionary(x => x.Key, x => x.Value);
                MemoryCache.Set(settingServiceCacheKey, dictSettings);
            }

            return dictSettings;
        }

        public async Task RefreshSettings()
        {
            var dictSettings = await AircashSimulatorContext.Settings.ToDictionaryAsync(x => x.Key, x => x.Value);
            MemoryCache.Set(settingServiceCacheKey, dictSettings);
        }

        public async Task UpdateSetting<T>(string key, T value)
        {
            var setting = await AircashSimulatorContext.Settings.FirstOrDefaultAsync(x => x.Key == key);
            if (setting == null)
                throw new Exception($"Setting ({key}) does not exist");
            setting.Value = JsonConvert.SerializeObject(value);
            AircashSimulatorContext.Update(setting);
            await AircashSimulatorContext.SaveChangesAsync();
            await RefreshSettings();
        }
    }
}
