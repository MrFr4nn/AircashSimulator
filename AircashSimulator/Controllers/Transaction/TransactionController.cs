using AircashSimulator.Configuration;
using AircashSimulator.Controllers.Transaction;
using AircashSimulator.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Services.Transaction;
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
        public async Task<IActionResult> GetTransactions([FromQuery(Name = "TransactionAmountFactor")] int transactionAmountFactor)
        {
            var transactionAmount = transactionAmountFactor * AircashConfiguration.TransactionAmountPerPage;
            var response = await TransactionService.GetTransactions(UserContext.GetPartnerId(User), transactionAmount);
            return Ok(response);
        }
    }
}
