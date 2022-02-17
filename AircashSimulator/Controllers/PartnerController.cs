using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace AircashSimulator
{

    [Route("api/[controller]/[action]")]
    [ApiController]
    public class PartnerController : ControllerBase
    {
        public PartnerController()
        {
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetPartners()
        {
            return Ok("Partners...");
        }
    }
}
