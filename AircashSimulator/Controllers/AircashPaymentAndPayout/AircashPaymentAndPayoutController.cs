using AircashSimulator.Controllers.AircashPayment;
using AircashSimulator.Extensions;
using CrossCutting;
using Domain.Entities.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.Settings;
using Services.AircashPaymentAndPayout;
using Services.Partner;
using Services.User;
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
        private IUserService UserService;
        private Guid partnerId;
        private Guid partnerTransactionId;

        public AircashPaymentAndPayoutController(IAircashPaymentAndPayoutService aircashPaymentAndPayoutService, UserContext userContext, ISettingsService settingsService, IHelperService helperService, IUserService userService)
        {
            AircashPaymentAndPayoutService = aircashPaymentAndPayoutService;
            UserContext = userContext;
            SettingsService = settingsService;
            HelperService = helperService;
            UserService = userService;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CheckCode(CheckCodeRequest checkCodeRequest)
        {
            partnerId = new Guid(checkCodeRequest.PartnerId);
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            var response = await AircashPaymentAndPayoutService.CheckCode(checkCodeRequest.BarCode, checkCodeRequest.LocationID, partnerId, environment);
            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CheckCodeV2(CheckCodeRequest checkCodeRequest)
        {
            partnerId = new Guid(checkCodeRequest.PartnerId);
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            var response = await AircashPaymentAndPayoutService.CheckCodeV2(checkCodeRequest.BarCode, checkCodeRequest.LocationID, partnerId, environment);
            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> ConfirmTransaction(ConfirmTransactionRequest confirmTransactionRequest)
        {
            partnerId = new Guid(confirmTransactionRequest.PartnerId);
            partnerTransactionId = new Guid(confirmTransactionRequest.PartnerTransactionId);
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            var userId = UserContext.GetUserId(User);
            var response = await AircashPaymentAndPayoutService.ConfirmTransaction(confirmTransactionRequest.BarCode, confirmTransactionRequest.LocationID, partnerId, userId, partnerTransactionId, environment);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CashierCheckCode(CheckCodeRequest checkCodeRequest)
        {
            var response = await AircashPaymentAndPayoutService.CheckCode(checkCodeRequest.BarCode, checkCodeRequest.LocationID, SettingsService.SalesPartnerId, checkCodeRequest.Environment);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CashierConfirmTransaction(ConfirmTransactionRequest confirmTransactionRequest)
        {
            var response = await AircashPaymentAndPayoutService.ConfirmTransaction(confirmTransactionRequest.BarCode, confirmTransactionRequest.LocationID, SettingsService.SalesPartnerId, Guid.NewGuid(), Guid.NewGuid(), confirmTransactionRequest.Environment);
            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CheckTransactionStatus(CheckTransactionStatusRequest checkTransactionStatusRequest)
        {
            partnerId = new Guid(checkTransactionStatusRequest.PartnerId);
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            var response = await AircashPaymentAndPayoutService.CheckTransactionStatus(checkTransactionStatusRequest.PartnerTransactionID, partnerId , environment);
            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CancelTransaction(CancelTransactionRequest cancelTransactionRequest)
        {
            partnerId = new Guid(cancelTransactionRequest.PartnerId);
            var environment = await UserService.GetUserEnvironment(UserContext.GetUserId(User));
            var userId = UserContext.GetUserId(User);
            var response = await AircashPaymentAndPayoutService.CancelTransaction(cancelTransactionRequest.PartnerTransactionID, cancelTransactionRequest.LocationID, partnerId, userId, environment);
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
            var response = await AircashPaymentAndPayoutService.CheckCode(barcode, SettingsService.SalesPartnerLocation, SettingsService.SalesPartnerId, EnvironmentEnum.Staging);
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
            var response = await AircashPaymentAndPayoutService.ConfirmTransaction(barcode, SettingsService.SalesPartnerLocation, SettingsService.SalesPartnerId, Guid.NewGuid(), partnerTransactionId, EnvironmentEnum.Staging);
            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CheckTransactionStatusSimulateError()
        {
            var partnerTransactionId = Guid.NewGuid().ToString();
            var response = await AircashPaymentAndPayoutService.CheckTransactionStatus(partnerTransactionId, SettingsService.SalesPartnerId, EnvironmentEnum.Staging);
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
            var response = await AircashPaymentAndPayoutService.CancelTransaction(partnerTransactionId.ToString(), SettingsService.SalesPartnerLocation, SettingsService.SalesPartnerId, Guid.NewGuid(), EnvironmentEnum.Staging);
            return Ok(response);
        }
    }
}
