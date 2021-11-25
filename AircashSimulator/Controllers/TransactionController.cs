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
        public TransactionController(ITransactionService transactionService)
        {
            TransactionService = transactionService;
        }

        [HttpGet]
        public async Task<IActionResult> GetTransactions()
        {
            //poziv poslovne logike
            var transactions = await TransactionService.GetTransactions(new Guid("8F62C8F0-7155-4C0E-8EBE-CD9357CFD1BF"));
            return Ok(transactions);
        }
    }
}

