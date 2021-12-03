using AircashSimulator.Configuration;
using Domain.Entities.Enum;
using Microsoft.AspNetCore.Mvc;
using Services.AircashPay;
using Microsoft.IdentityModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AircashSignature;
using Microsoft.AspNetCore.Authorization;
using AircashSimulator.Extensions;

namespace AircashSimulator.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AircashPayController : Controller
    {
        private IAircashPayService AircashPayService;
        private UserContext UserContext;
        public AircashPayController(IAircashPayService aircashPayService, UserContext userContext)
        {
            AircashPayService = aircashPayService;
            UserContext = userContext;
        }
        
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> GeneratePartnerCode(GeneratePartnerCodeRequest GeneratePartnerCodeRequest)
        {
            var generatePartnerCodeDTO = new GeneratePartnerCodeDTO
            {
                PartnerId = UserContext.GetPartnerId(User),
                Amount = GeneratePartnerCodeRequest.Amount,
                Description = GeneratePartnerCodeRequest.Description,
                LocationId = GeneratePartnerCodeRequest.LocationId
            };

            var response = await AircashPayService.GeneratePartnerCode(generatePartnerCodeDTO);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> ConfirmTransaction(AircashConfirmTransactionRequest aircashConfirmTransactionRequest)
        {
            var dataToVerify = AircashSignatureService.ConvertObjectToString(aircashConfirmTransactionRequest);
            var signature = aircashConfirmTransactionRequest.Signature;
            bool valid = AircashSignatureService.VerifySignature(dataToVerify, signature, "C:");
            if (valid == true)
            {
                var TransactionDTO = new TransactionDTO
                {
                    Amount = aircashConfirmTransactionRequest.Amount,
                    ISOCurrencyId = (CurrencyEnum)aircashConfirmTransactionRequest.CurrencyId,
                    PartnerId = new Guid(aircashConfirmTransactionRequest.PartnerId),
                    AircashTransactionId = aircashConfirmTransactionRequest.AircashTransactionId,
                    PartnerTransactionId = new Guid(aircashConfirmTransactionRequest.PartnerTransactionId),
                    UserId = UserContext.GetUserId(User)
    };
                var response = await AircashPayService.ConfirmTransaction(TransactionDTO);
                return Ok(response);
            }
            else
            {
                return BadRequest();
            }
            
        }
    }
}
