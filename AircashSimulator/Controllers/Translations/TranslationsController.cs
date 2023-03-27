using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Services.Translations;
namespace AircashSimulator.Controllers.Translations
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class TranslationsController : ControllerBase
    {
        private ITranslationsService TranslationsService;
        public TranslationsController(ITranslationsService translationsService)
        {
            TranslationsService = translationsService;
        }
        [HttpGet]
        public async Task<IActionResult> GetTranslations(string locale)
        {
            var response = await TranslationsService.GetTranslations(locale);
            return Ok(response);
        }
    }
}
