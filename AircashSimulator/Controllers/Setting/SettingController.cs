using Microsoft.AspNetCore.Mvc;
using Service.Settings;
using Services.Translations;
using System.Threading.Tasks;

namespace AircashSimulator.Controllers.Setting
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class SettingController : ControllerBase
    {
        private ISettingsService SettingsService;
        public SettingController(ISettingsService settingService)
        {
            SettingsService = settingService;
        }
        [HttpGet]
        public async Task<IActionResult> GetSettings()
        {
            return Ok(SettingsService.GetSettings());
        }

        [HttpGet]
        public async Task<IActionResult> RefreshSettings()
        {
            await SettingsService.RefreshSettings();
            return Ok();
        }
    }
}
