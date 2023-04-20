using AircashSignature;
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
            try
            {
                var bytePublicKey = Encoding.UTF8.GetBytes(validatePublicKeyDTO.publicKey);
                var certificate = new X509Certificate2(bytePublicKey);
                return Ok("Public key valid");
            }
            catch
            {
                return Ok("Public key invalid");
            }
        }
    }
}
