﻿using DataAccess;
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
        public string AircashSimulatorPublicKeyPath { get { return GetSetting("AircashSimulatorPublicKeyPath", string.Empty, throwExceptionIfMissing: true); } }
        public string PrivateKeyForInvalidSignature { get { return GetSetting("PrivateKeyForInvalidSignature", string.Empty, throwExceptionIfMissing: true); } }
        public string AircashSimulatorPrivateKeyPass { get { return GetSetting("AircashSimulatorPrivateKeyPass", string.Empty, throwExceptionIfMissing: true); } }
        public string UsedCuponCodeForSimulatingError { get { return GetSetting("UsedCuponCodeForSimulatingError", string.Empty, throwExceptionIfMissing: true); } }
        public string ValidCuponCodeForSimulatingError { get { return GetSetting("ValidCuponCodeForSimulatingError", string.Empty, throwExceptionIfMissing: true); } }
        public string SixteenDigitCodeBA { get { return GetSetting("SixteenDigitCodeBA", string.Empty, throwExceptionIfMissing: true); } }
        public string PointOfSaleIdCashier { get { return GetSetting("PointOfSaleIdCashier", string.Empty, throwExceptionIfMissing: true); } }
        public string PointOfSaleId { get { return GetSetting("PointOfSaleId", string.Empty, throwExceptionIfMissing: true); } }
        public string AbonInvalidCurrencySymbol { get { return GetSetting("AbonInvalidCurrencySymbol", string.Empty, throwExceptionIfMissing: true); } }
        public string AbonPointOfSalesIdsDoNotMatch { get { return GetSetting("AbonPointOfSalesIdsDoNotMatch", string.Empty, throwExceptionIfMissing: true); } }
        public string AbonUnusedCouponSerialNumber { get { return GetSetting("AbonUnusedCouponSerialNumber", string.Empty, throwExceptionIfMissing: true); } }
        public string AbonAlradyUsedCouponSerialNumber { get { return GetSetting("AbonAlradyUsedCouponSerialNumber", string.Empty, throwExceptionIfMissing: true); } }
        public string AbonCanceledCouponSerialNumber { get { return GetSetting("AbonCanceledCouponSerialNumber", string.Empty, throwExceptionIfMissing: true); } }
        public string AbonExpiredCouponSerialNumber { get { return GetSetting("AbonExpiredCouponSerialNumber", string.Empty, throwExceptionIfMissing: true); } }
        public string AbonTimedOutCouponSerialNumber { get { return GetSetting("AbonTimedOutCouponSerialNumber", string.Empty, throwExceptionIfMissing: true); } }
        public decimal AbonDefaultValue { get { return GetSetting("AbonDefaultValue", decimal.Zero, throwExceptionIfMissing: true); } }
        public decimal AbonInvalidValue { get { return GetSetting("AbonInvalidValue", decimal.Zero, throwExceptionIfMissing: true); } }
        public string TestAircashPaymentPath { get { return GetSetting("TestAircashPaymentPath", string.Empty, throwExceptionIfMissing: true); } }
        public string TestAircashPaymentPass { get { return GetSetting("TestAircashPaymentPass", string.Empty, throwExceptionIfMissing: true); } }
        public string TestPhoneNumber { get { return GetSetting("TestPhoneNumber", string.Empty, throwExceptionIfMissing: true); } }
        public string BlockedPhoneNumber { get { return GetSetting("BlockedPhoneNumber", string.Empty, throwExceptionIfMissing: true); } }
        public decimal PayoutDefaultAmount { get { return GetSetting("PayoutDefaultAmount", decimal.Zero, throwExceptionIfMissing: true); } }
        public decimal PayoutAmountTooSmall { get { return GetSetting("PayoutAmountTooSmall", decimal.Zero, throwExceptionIfMissing: true); } }
        public decimal PayoutAmountTooBig { get { return GetSetting("PayoutAmountTooBig", decimal.Zero, throwExceptionIfMissing: true); } }
        public string AircashFrameDefaultLocale { get { return GetSetting("AircashFrameDefaultLocale", string.Empty, throwExceptionIfMissing: true); } }
        public int AbonSPCashierNumberOfCouponCodesPerDenomination { get { return GetSetting("AbonSPCashierNumberOfCouponCodesPerDenomination", 0, throwExceptionIfMissing: true); } }
        public decimal AircashFrameDefaultAmount { get { return GetSetting("AircashFrameDefaultAmount", decimal.Zero, throwExceptionIfMissing: true); } }
        public decimal AcFrameConfirmPayoutAmountMismatch { get { return GetSetting("AcFrameConfirmPayoutAmountMismatch", decimal.Zero, throwExceptionIfMissing: true); } }
        public string SalesPartnerLocation { get { return GetSetting("SalesPartnerLocation", string.Empty, throwExceptionIfMissing: true); } }
        public string ValidBarcode { get { return GetSetting("ValidBarcode", string.Empty, throwExceptionIfMissing: true); } }
        public string UsedBarcode { get { return GetSetting("UsedBarcode", string.Empty, throwExceptionIfMissing: true); } }
        public string AbonCashierNotificationUrl { get { return GetSetting("AbonCashierNotificationUrl", string.Empty, throwExceptionIfMissing: true); } }

        public string BarcodeOverLimit { get { return GetSetting("BarcodeOverLimit", string.Empty, throwExceptionIfMissing: true); } }
        public string NotCheckedBarcode { get { return GetSetting("NotCheckedBarcode", string.Empty, throwExceptionIfMissing: true); } }
        public Guid AbonOnlinePartnerId { get { return GetSetting("AbonOnlinePartnerId", Guid.Empty, throwExceptionIfMissing: true); } }
        public Guid AbonOnlinePartnerIdWithoutAuthorization { get { return GetSetting("AbonOnlinePartnerIdWithoutAuthorization", Guid.Empty, throwExceptionIfMissing: true); } }
        public Guid AircashPayoutV4PartnerId { get { return GetSetting("AircashPayoutV4PartnerId", Guid.Empty, throwExceptionIfMissing: true); } }
        public Guid C2DPayoutPartnerId { get { return GetSetting("C2DPayoutPartnerId", Guid.Empty, throwExceptionIfMissing: true); } }
        public Guid C2DDepositPartnerId { get { return GetSetting("C2DDepositPartnerId", Guid.Empty, throwExceptionIfMissing: true); } }
        public Guid AcPayPartnerId { get { return GetSetting("AcPayPartnerId", Guid.Empty, throwExceptionIfMissing: true); } }
        public Guid InAppPayPartnerId { get { return GetSetting("InAppPayPartnerId", Guid.Empty, throwExceptionIfMissing: true); } }
        public Guid AbonGenerateBlockedPartnerId { get { return GetSetting("AbonGenerateBlockedPartnerId", Guid.Empty, throwExceptionIfMissing: true); } }
        public string AircashFramePartnerTransactionAlreadyExists { get { return GetSetting("AircashFramePartnerTransactionAlreadyExists", string.Empty, throwExceptionIfMissing: true); } }
        public Guid AcFrameConfirmPayoutValidTransaction { get { return GetSetting("AcFrameConfirmPayoutValidTransaction", Guid.Empty, throwExceptionIfMissing: true); } }
        public Guid AcFrameConfirmPayoutTransactionConfirmationNotAllowed { get { return GetSetting("AcFrameConfirmPayoutTransactionConfirmationNotAllowed", Guid.Empty, throwExceptionIfMissing: true); } }
        public Guid AircashFrameTransactionNotProcessed { get { return GetSetting("AircashFrameTransactionNotProcessed", Guid.Empty, throwExceptionIfMissing: true); } }
        public Guid AbonGeneratePartnerIdsDoNotMatch { get { return GetSetting("AbonGeneratePartnerIdsDoNotMatch", Guid.Empty, throwExceptionIfMissing: true); } }
        public Guid AbonGeneratePartnerId { get { return GetSetting("AbonGeneratePartnerId", Guid.Empty, throwExceptionIfMissing: true); } }
        public string CouponExistsForTheGivenPartnerTransactionId { get { return GetSetting("CouponExistsForTheGivenPartnerTransactionId", string.Empty, throwExceptionIfMissing: true); } }
        public Guid AircashPayoutPartnerId { get { return GetSetting("AircashPayoutPartnerId", Guid.Empty, throwExceptionIfMissing: true); } }
        public string PartnerTransactionIdAlreadyExists { get { return GetSetting("PartnerTransactionIdAlreadyExists", string.Empty, throwExceptionIfMissing: true); } }
        public Guid BlockedUserId { get { return GetSetting("BlockedUserId", Guid.Empty, throwExceptionIfMissing: true); } }
        public Guid AircashFramePartnerId { get { return GetSetting("AircashFramePartnerId", Guid.Empty, throwExceptionIfMissing: true); } }
        public Guid AircashFrameAmountDefaultPartnerId { get { return GetSetting("AircashFrameAmountDefaultPartnerId", Guid.Empty, throwExceptionIfMissing: true); } }
        public Guid AircashFrameAmountLessThanCouponValuePartnerId { get { return GetSetting("AircashFrameAmountLessThanCouponValuePartnerId", Guid.Empty, throwExceptionIfMissing: true); } }
        public Guid AircashFrameAmountEqualOrLessThanCouponValuePartnerId { get { return GetSetting("AircashFrameAmountEqualOrLessThanCouponValuePartnerId", Guid.Empty, throwExceptionIfMissing: true); } }
        public Guid AircashFrameAmountEqualAsCouponValuePartnerId { get { return GetSetting("AircashFrameAmountEqualAsCouponValuePartnerId", Guid.Empty, throwExceptionIfMissing: true); } }
        public Guid AircashFramePartnerIdWithMatchPersonalData { get { return GetSetting("AircashFramePartnerIdWithMatchPersonalData", Guid.Empty, throwExceptionIfMissing: true); } }
        public Guid SalesPartnerId { get { return GetSetting("SalesPartnerId", Guid.Empty, throwExceptionIfMissing: true); } }
        public Guid UnableToCancelPayoutTransactionId { get { return GetSetting("UnableToCancelPayoutTransactionId", Guid.Empty, throwExceptionIfMissing: true); } }
        public Guid TransactionAlreadyCanceledId { get { return GetSetting("TransactionAlreadyCanceledId", Guid.Empty, throwExceptionIfMissing: true); } }
        public Guid AcPayCashRegisterId { get { return GetSetting("AcPayCashRegisterId", Guid.Empty , throwExceptionIfMissing: true); } }
        public Guid MatchPersonalDataDefault { get { return GetSetting("MatchPersonalDataDefault", Guid.Empty , throwExceptionIfMissing: true); } }
        public Guid MatchPersonalDataDateOnly { get { return GetSetting("MatchPersonalDataDateOnly", Guid.Empty , throwExceptionIfMissing: true); } }
        public Dictionary<string, Guid> RecourcesGenerateAbonPartnerIds { get { return GetSetting("RecourcesGenerateAbonPartnerIds", new Dictionary<string, Guid>() , throwExceptionIfMissing: true); } }
        public string TestAdminPrivateKeyPath { get { return GetSetting("TestAdminPrivateKeyPath", string.Empty, throwExceptionIfMissing: true); } }
        public string TestAdminPrivateKeyPass { get { return GetSetting("TestAdminPrivateKeyPass", string.Empty, throwExceptionIfMissing: true); } }
      
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
            else if (type == typeof(Dictionary<string, Guid>))
                return (T)Convert.ChangeType(JsonConvert.DeserializeObject<Dictionary<string, Guid>>(strValue), type);
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
