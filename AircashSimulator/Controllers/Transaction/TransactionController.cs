using AircashSimulator.Configuration;
using AircashSimulator.Controllers.Transaction;
using AircashSimulator.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Services.Transaction;
using Services.Transactions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
        public async Task<IActionResult> GetTransactions([FromQuery(Name = "PageSize")] int pageSize, [FromQuery(Name = "PageNumber")] int pageNumber)
        {
            var response = await TransactionService.GetTransactions(UserContext.GetPartnerId(User), pageSize, pageNumber);
            return Ok(response);
        }
    }
}
