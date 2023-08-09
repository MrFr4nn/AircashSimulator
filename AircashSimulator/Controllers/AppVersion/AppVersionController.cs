using Microsoft.AspNetCore.Mvc;
using Services.AppVersion;

namespace AircashSimulator.Controllers.AppVersion
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AppVersionController
    {
        private readonly IAppVersionService AppVersionService;
        public AppVersionController(IAppVersionService appVersionService)
        {
            AppVersionService = appVersionService;
        }

        [HttpGet]
        public string GetAppVersion()
        {
            return AppVersionService.Version;
        }
    }
}
