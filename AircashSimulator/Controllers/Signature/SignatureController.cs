using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;

namespace AircashSimulator.Controllers.Signature
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class SignatureController : Controller
    { 
        public SignatureController() 
        {
        }

        [HttpPost]
        public async Task<IActionResult> ValidatePublicKey(ValidatePublicKeyDTO validatePublicKeyDTO) 
        {
            byte[] key = Encoding.ASCII.GetBytes(validatePublicKeyDTO.publicKey);
            X509Certificate2 cert = new X509Certificate2(key);
            return Ok("Public key valid");
        }
    }
}
