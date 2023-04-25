using AircashSimulator.Controllers.AircashPayment;
using AircashSimulator.Extensions;
using CrossCutting;
using Domain.Entities.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.Settings;
using Services.AircashPaymentAndPayout;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AircashSimulator.Controllers.AircashPaymentAndPayout
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AircashPaymentAndPayoutController : ControllerBase
    {
        private ISettingsService SettingsService;
        private IHelperService HelperService;
        private IAircashPaymentAndPayoutService AircashPaymentAndPayoutService;
        private UserContext UserContext;

        public AircashPaymentAndPayoutController(IAircashPaymentAndPayoutService aircashPaymentAndPayoutService, UserContext userContext, ISettingsService settingsService, IHelperService helperService)
        {
            AircashPaymentAndPayoutService = aircashPaymentAndPayoutService;
            UserContext = userContext;
            SettingsService = settingsService;
            HelperService = helperService;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CheckCode(CheckCodeRequest checkCodeRequest)
        {
            var response = await AircashPaymentAndPayoutService.CheckCode(checkCodeRequest.BarCode, checkCodeRequest.LocationID, SettingsService.SalesPartnerId);
            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> ConfirmTransaction(ConfirmTransactionRequest confirmTransactionRequest)
        {
            var userId = UserContext.GetUserId(User);
            var response = await AircashPaymentAndPayoutService.ConfirmTransaction(confirmTransactionRequest.BarCode, confirmTransactionRequest.LocationID, SettingsService.SalesPartnerId, userId, Guid.NewGuid());
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CashierCheckCode(CheckCodeRequest checkCodeRequest)
        {
            var response = await AircashPaymentAndPayoutService.CheckCode(checkCodeRequest.BarCode, checkCodeRequest.LocationID, SettingsService.SalesPartnerId);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CashierConfirmTransaction(ConfirmTransactionRequest confirmTransactionRequest)
        {
            var response = await AircashPaymentAndPayoutService.ConfirmTransaction(confirmTransactionRequest.BarCode, confirmTransactionRequest.LocationID, SettingsService.SalesPartnerId, Guid.NewGuid(), Guid.NewGuid());
            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CheckTransactionStatus(CheckTransactionStatusRequest checkTransactionStatusRequest)
        {
            var response = await AircashPaymentAndPayoutService.CheckTransactionStatus(checkTransactionStatusRequest.PartnerTransactionID, SettingsService.SalesPartnerId);
            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CancelTransaction(CancelTransactionRequest cancelTransactionRequest)
        {
            var userId = UserContext.GetUserId(User);
            var response = await AircashPaymentAndPayoutService.CancelTransaction(cancelTransactionRequest.PartnerTransactionID, cancelTransactionRequest.LocationID, SettingsService.SalesPartnerId, userId);
            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CheckCodeSimulateError([FromBody] SalesPartnerCheckCodeErrorEnum errorCode)
        {
            var barcode = "";
            switch (errorCode)
            {
                case SalesPartnerCheckCodeErrorEnum.InvalidBarcode:
                {
                    barcode = "AC" + HelperService.RandomNumber(14);
                    break;
                }
                case SalesPartnerCheckCodeErrorEnum.BarcodeAlreadyUsed:
                {
                    barcode = SettingsService.UsedBarcode;
                    break;
                }
                case SalesPartnerCheckCodeErrorEnum.TransactionLimit:
                {
                    barcode = SettingsService.BarcodeOverLimit;
                    break;
                }
                default:
                {
                    return BadRequest();
                }
            }
            var response = await AircashPaymentAndPayoutService.CheckCode(barcode, SettingsService.SalesPartnerLocation, SettingsService.SalesPartnerId);
            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> ConfirmTransactionSimulateError([FromBody] SalesPartnerConfirmTransactionErroCodeEnum errorCode)
        {
            var barcode = SettingsService.ValidBarcode;
            var partnerTransactionId = Guid.NewGuid();
            switch (errorCode)
            {
                case SalesPartnerConfirmTransactionErroCodeEnum.BarcodeAlreadyUsed:
                {
                    barcode = SettingsService.UsedBarcode;
                    break;
                }
                case SalesPartnerConfirmTransactionErroCodeEnum.TransactionLimit:
                {
                    barcode = SettingsService.BarcodeOverLimit;
                    break;
                }
                case SalesPartnerConfirmTransactionErroCodeEnum.PartnerTransactionIdIsNotUnique:
                {
                    partnerTransactionId = SettingsService.PartnerTransactionIdAlreadyExists;
                    break;
                }
                case SalesPartnerConfirmTransactionErroCodeEnum.UnableToConfirmTransactionWithoutCallingCheckBarcodeFirst:
                {
                    barcode = SettingsService.NotCheckedBarcode;
                    break;
                }
                default:
                {
                    return BadRequest();
                }
            }
            var response = await AircashPaymentAndPayoutService.ConfirmTransaction(barcode, SettingsService.SalesPartnerLocation, SettingsService.SalesPartnerId, Guid.NewGuid(), partnerTransactionId);
            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CheckTransactionStatusSimulateError()
        {
            var partnerTransactionId = Guid.NewGuid().ToString();
            var response = await AircashPaymentAndPayoutService.CheckTransactionStatus(partnerTransactionId, SettingsService.SalesPartnerId);
            return Ok(response);
        }

        [HttpPost]
        [Authorize] 
        public async Task<IActionResult> CancelTransactionSimulateError([FromBody] SalesPartnerCancelTransactionErrorCodeEnum errorCode)
        {
            var partnerTransactionId = Guid.NewGuid();
            switch (errorCode)
            {
                case SalesPartnerCancelTransactionErrorCodeEnum.UnableToCancelPayout:
                {
                    partnerTransactionId = SettingsService.UnableToCancelPayoutTransactionId;
                    break;
                }
                case SalesPartnerCancelTransactionErrorCodeEnum.TransactionAlreadyCanceled:
                {
                    partnerTransactionId = SettingsService.TransactionAlreadyCanceledId;
                    break;
                }
                case SalesPartnerCancelTransactionErrorCodeEnum.TransactionInWrongStatus:
                {
                    return Ok();
                }
                case SalesPartnerCancelTransactionErrorCodeEnum.CancellationPeriodExpired:
                {
                    return Ok();
                }
                default:
                    return BadRequest();
            }
            var response = await AircashPaymentAndPayoutService.CancelTransaction(partnerTransactionId.ToString(), SettingsService.SalesPartnerLocation, SettingsService.SalesPartnerId, Guid.NewGuid());
            return Ok(response);
        }
    }
}
