using Domain.Entities.Enum;
using Microsoft.AspNetCore.Mvc;
using Services.AircashPay;
using System;
using System.Threading.Tasks;
using AircashSignature;
using Microsoft.AspNetCore.Authorization;
using AircashSimulator.Extensions;
using Services.HttpRequest;

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
                LocationId = GeneratePartnerCodeRequest.LocationID,
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
            //bool valid = AircashSignatureService.VerifySignature(dataToVerify, signature, "C:");
            //if (valid == true)
            if (signature == "Ok")
            {
                var TransactionDTO = new TransactionDTO
                {
                    Amount = aircashConfirmTransactionRequest.Amount,
                    ISOCurrencyId = (CurrencyEnum)aircashConfirmTransactionRequest.CurrencyID,
                    PartnerId = new Guid(aircashConfirmTransactionRequest.PartnerID),
                    AircashTransactionId = aircashConfirmTransactionRequest.AircashTransactionID,
                    PartnerTransactionId = new Guid(aircashConfirmTransactionRequest.PartnerTransactionID)
                };
                var response = await AircashPayService.ConfirmTransaction(TransactionDTO);
                if (((HttpResponse)response).ResponseCode == System.Net.HttpStatusCode.OK)
                {
                    return Ok(response);
                }
                else
                {
                    return BadRequest(response);
                }
                
            }
            else
            {
                return Unauthorized("Invalid signature.");
            }
            
        }
    }
}
