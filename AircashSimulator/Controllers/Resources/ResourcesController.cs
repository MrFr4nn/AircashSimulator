using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Service.Settings;
using Services.Resources;
using Domain.Entities.Enum;

namespace AircashSimulator.Controllers.Resources
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ResourcesController : ControllerBase
    {
        private ISettingsService SettingsService;
        private IResourcesService ResourcesService;

        public ResourcesController(ISettingsService settingsService, IResourcesService resourcesService)
        {
            SettingsService = settingsService;
            ResourcesService = resourcesService;
        }

        [HttpGet]
        public async Task<string> GetCoupon([FromQuery(Name = "currencyIsoCode")] string currencyIsoCode) {
            var response = await ResourcesService.CreateCoupon(currencyIsoCode);
            return response;
        }
    }
}
