using Services.Transactions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using AircashSimulator.Extensions;
using Microsoft.Extensions.Options;
using AircashSimulator.Configuration;
using Microsoft.AspNetCore.Authorization;
using Domain.Entities.Enum;
using System.Collections.Generic;

namespace AircashSimulator
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class TransactionController : ControllerBase
    {
        private ITransactionService TransactionService;
        private UserContext UserContext;
        private AircashConfiguration AircashConfiguration;
        public TransactionController(ITransactionService transactionService, UserContext userContext, IOptionsMonitor<AircashConfiguration> aircashConfiguration)
        {
            TransactionService = transactionService;
            UserContext = userContext;
            AircashConfiguration = aircashConfiguration.CurrentValue;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetTransactions([FromQuery(Name = "PageSize")] int pageSize, [FromQuery(Name = "PageNumber")] int pageNumber, [FromQuery(Name = "Services")] List<ServiceEnum> services)
        {
            var response = await TransactionService.GetTransactions(UserContext.GetPartnerId(User), pageSize, pageNumber, services);
            return Ok(response);
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAircashFramePreparedTransactions([FromQuery(Name = "PageSize")] int pageSize, [FromQuery(Name = "PageNumber")] int pageNumber)
        {
            var response = await TransactionService.GetAircashFramePreparedTransactions(UserContext.GetPartnerId(User), pageSize, pageNumber);
            return Ok(response);
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAircashPayPreparedTransactions([FromQuery(Name = "PageSize")] int pageSize, [FromQuery(Name = "PageNumber")] int pageNumber)
        {
            var response = await TransactionService.GetAircashPayPreparedTransactions(UserContext.GetPartnerId(User), pageSize, pageNumber);
            return Ok(response);
        }
    }
}
