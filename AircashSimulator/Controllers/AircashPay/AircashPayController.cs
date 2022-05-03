using System;
using AircashSignature;
using Services.AircashPay;
using Domain.Entities.Enum;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using AircashSimulator.Extensions;
using Microsoft.Extensions.Options;
using AircashSimulator.Configuration;
using Microsoft.AspNetCore.Authorization;
using AircashSimulator.Controllers.AircashPay;

namespace AircashSimulator.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AircashPayController : Controller
    {
        private IAircashPayService AircashPayService;
        private UserContext UserContext;
        private AircashConfiguration AircashConfiguration;
        public AircashPayController(IAircashPayService aircashPayService, UserContext userContext, IOptionsMonitor<AircashConfiguration> aircashConfiguration)
        {
            AircashPayService = aircashPayService;
            UserContext = userContext;
            AircashConfiguration = aircashConfiguration.CurrentValue;
        }
        
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> GeneratePartnerCode(GeneratePartnerCodeRequest generatePartnerCodeRequest)
        {
            var generatePartnerCodeDTO = new GeneratePartnerCodeDTO
            {
                PartnerId = UserContext.GetPartnerId(User),
                Amount = generatePartnerCodeRequest.Amount,
                Description = generatePartnerCodeRequest.Description,
                LocationId = generatePartnerCodeRequest.LocationID,
                UserId = UserContext.GetUserId(User)
            };

            var response = await AircashPayService.GeneratePartnerCode(generatePartnerCodeDTO);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> ConfirmTransaction(AircashConfirmTransactionRequest aircashConfirmTransactionRequest)
        {
            var dataToVerify = AircashSignatureService.ConvertObjectToString(aircashConfirmTransactionRequest);
            var signature = aircashConfirmTransactionRequest.Signature;
            bool valid = AircashSignatureService.VerifySignature(dataToVerify, signature, $"{AircashConfiguration.AcPayPublicKey}");
            if (valid == true)
            {
                var transactionDTO = new TransactionDTO
                {
                    Amount = aircashConfirmTransactionRequest.Amount,
                    ISOCurrencyId = (CurrencyEnum)aircashConfirmTransactionRequest.CurrencyID,
                    PartnerId = new Guid(aircashConfirmTransactionRequest.PartnerID),
                    AircashTransactionId = aircashConfirmTransactionRequest.AircashTransactionID,
                    PartnerTransactionId = new Guid(aircashConfirmTransactionRequest.PartnerTransactionID)
                };
                var response = await AircashPayService.ConfirmTransaction(transactionDTO);
                if (((ConfirmResponse)response).ResponseCode == 1)
                {
                    return Ok("Transaction confirmed successfully");
                }
                else
                {
                    return BadRequest("Unable to find transaction");
                }

            }
            else
            {
                return BadRequest("Invalid signatue");
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CancelTransaction(CancelTransaction cancelTransactionRequest)
        {
            var cancelTransactionDTO = new CancelTransactionDTO
            {
                PartnerId = UserContext.GetPartnerId(User),
                PartnerTransactionId = new Guid(cancelTransactionRequest.PartnerTransactionID),
                UserId = UserContext.GetUserId(User)
            };
            var response = await AircashPayService.CancelTransaction(cancelTransactionDTO);
            return Ok(response);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> RefundTransaction(RefundTransaction refundTransactionRequest)
        {
            var refundTransactionDTO = new RefundTransactionDTO
            {
                PartnerId = UserContext.GetPartnerId(User),
                PartnerTransactionId = new Guid(refundTransactionRequest.PartnerTransactionID),
                RefundPartnerTransactionId = Guid.NewGuid(),
                Amount= refundTransactionRequest.Amount
            };
            var response = await AircashPayService.RefundTransaction(refundTransactionDTO);
            return Ok(response);
        }
    }
}
