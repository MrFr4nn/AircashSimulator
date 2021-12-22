using AircashSimulator.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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

        public TransactionController(ITransactionService transactionService, UserContext userContext)
        {
            TransactionService = transactionService;
            UserContext = userContext;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetTransactions(int pageSize, int pageNumber)
        {
            var partnerId = UserContext.GetPartnerId(User);
            var transactions = await TransactionService.GetTransactions(partnerId, pageSize, pageNumber);
            return Ok(transactions);
        }
    }
}

