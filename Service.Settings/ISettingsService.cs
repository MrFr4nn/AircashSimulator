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
        string AbonPointOfSalesIdsDoNotMatch { get; }
        string AbonUnusedCouponSerialNumber { get; }
        string AbonAlradyUsedCouponSerialNumber { get; }
        string AbonCanceledCouponSerialNumber { get; }
        string AbonExpiredCouponSerialNumber { get; }
        string AbonTimedOutCouponSerialNumber { get; }
        decimal AbonDefaultValue { get; }
        decimal AbonInvalidValue { get; }
        string TestAircashPaymentPath { get; }
        string TestAircashPaymentPass { get; }
        string TestPhoneNumber { get; }
        string BlockedPhoneNumber { get; }
        decimal PayoutDefaultAmount { get; }
        decimal PayoutAmountTooSmall { get; }
        decimal PayoutAmountTooBig { get; }
        string AircashFrameDefaultLocale { get; }
        decimal AircashFrameDefaultAmount { get; }
        decimal AcFrameConfirmPayoutAmountMismatch { get; }
        string SalesPartnerLocation { get; }
        string ValidBarcode { get; }
        string UsedBarcode { get; }
        string BarcodeOverLimit { get; }
        string NotCheckedBarcode { get; }
        Guid AbonOnlinePartnerId { get; }
        Guid AbonGeneratePartnerId { get; }
        Guid AircashFramePartnerTransactionAlreadyExists { get; }
        Guid AcFrameConfirmPayoutValidTransaction { get; }
        Guid AcFrameConfirmPayoutTransactionConfirmationNotAllowed { get; }
        Guid AircashFrameTransactionNotProcessed { get; }
        Guid AbonGenerateBlockedPartnerId { get; }
        Guid AbonGeneratePartnerIdsDoNotMatch { get; }
        Guid CouponExistsForTheGivenPartnerTransactionId { get; }
        Guid AircashPayoutPartnerId { get; }
        Guid PartnerTransactionIdAlreadyExists { get; }
        Guid BlockedUserId { get; }
        Guid SalesPartnerId { get; }
        Guid UnableToCancelPayoutTransactionId { get; }
        Guid TransactionAlreadyCanceledId { get; }
        Guid AircashFramePartnerId { get; }
    }
}
