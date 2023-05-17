using AircashSimulator.Controllers.AircashPayout;
using AircashSimulator.Extensions;
using CrossCutting;
using Microsoft.AspNetCore.Mvc;
using Services.AircashPayout;
using System;
using System.Threading.Tasks;

namespace AircashSimulator.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AircashPayoutController : ControllerBase
    {
        private IAircashPayoutService AircashPayoutService;
        private UserContext UserContext;
        private IHelperService HelperService;
        private readonly Guid PartnerId = new Guid("0a13af2f-9d8e-4afd-b3e0-8f4c24095cd6");
        private readonly Guid UserId = new Guid("358B9D22-BB9A-4311-B94D-8F6DAEB38B40");

        public AircashPayoutController(IAircashPayoutService aircashPayoutService, UserContext userContext, IHelperService helperService)
        {
            AircashPayoutService = aircashPayoutService;
            UserContext = userContext;
            HelperService = helperService;

        }

        [HttpPost]
        public async Task<IActionResult> CheckUser(CheckUserRequest checkUserRequest)
        {
            var response = await AircashPayoutService.CheckUser(checkUserRequest.PhoneNumber, UserContext.GetUserId(User).ToString(), UserContext.GetPartnerId(User));
            return Ok(response);
        }
        public object GetCurlCheckUser(CheckUserRequest checkUserRequest)
        {
            var user = UserContext.GetPartnerId(User);
            var request =  AircashPayoutService.GetCheckUserRequest(checkUserRequest.PhoneNumber, UserContext.GetUserId(User).ToString(), UserContext.GetPartnerId(User));
            var curl = HelperService.GetCurl(request, AircashPayoutService.GetCheckUserEndpoint(user));
            return Ok(curl);
        }

        [HttpPost]
        public async Task<IActionResult> CreatePayout(CreatePayoutRequest createPayoutRequest)
        {
            var response = await AircashPayoutService.CreatePayout(createPayoutRequest.PhoneNumber, createPayoutRequest.Amount, UserContext.GetUserId(User), UserContext.GetPartnerId(User));
            return Ok(response);
        }
        public object GetCurlCreatePayout(CreatePayoutRequest createPayoutRequest)
        {
            var user = UserContext.GetPartnerId(User);
            var request =  AircashPayoutService.GetCreatePayoutRequest(createPayoutRequest.PhoneNumber, createPayoutRequest.Amount, UserContext.GetUserId(User), UserContext.GetPartnerId(User));
            var curl = HelperService.GetCurl(request, AircashPayoutService.GetCreatePayoutEndpoint(user));
            return Ok(curl);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCashierPayout(CreatePayoutRequest createPayoutRequest)
        {
            var response = await AircashPayoutService.CreatePayout(createPayoutRequest.PhoneNumber, createPayoutRequest.Amount, UserId, PartnerId);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CheckTransactionStatus(CheckTransactionStatusRequest checkTransactionStatusRequest)
        {
            var response = await AircashPayoutService.CheckTransactionStatus(checkTransactionStatusRequest.PartnerTransactionId);
            return Ok(response);
        }
        public object GetCurlCheckTransactionStatus(CheckTransactionStatusRequest checkTransactionStatusRequest)
        {
            var request =  AircashPayoutService.GetCheckTransactionStatusRequest(checkTransactionStatusRequest.PartnerTransactionId);
            var curl = HelperService.GetCurl(request, AircashPayoutService.GetCheckTransactionStatusEndpoint(checkTransactionStatusRequest.PartnerTransactionId));
            return Ok(curl);
        }
    }

}
