using Microsoft.AspNetCore.Mvc;
using Services.AircashPay;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AircashSimulator.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AircashPayController : Controller
    {
        public IAircashPayService AircashPayService;
        public AircashPayController(IAircashPayService aircashPayService)
        {
            AircashPayService = aircashPayService;
        }

        [HttpPost]
        public async Task<IActionResult> GeneratePartnerCode(GeneratePartnerCodeRequest GeneratePartnerCodeRequest)
        {
            var response = await AircashPayService.GeneratePartnerCode( GeneratePartnerCodeRequest.PartnerId, 
                                                                        GeneratePartnerCodeRequest.Amount, 
                                                                        GeneratePartnerCodeRequest.ISOCurrencyId, 
                                                                        GeneratePartnerCodeRequest.Description, 
                                                                        GeneratePartnerCodeRequest.ValidForPeriod, 
                                                                        GeneratePartnerCodeRequest.LocationId);
            return Ok(response);
        }
    }
}
