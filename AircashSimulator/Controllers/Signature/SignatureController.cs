using AircashSignature;
using AircashSimulator.Extensions;
using Microsoft.AspNetCore.Mvc;
using Services.Signature;
using System;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;
namespace AircashSimulator.Controllers.Signature
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class SignatureController : Controller
    {
        private ISignatureService SignatureService;
        private UserContext UserContext;
        public SignatureController(ISignatureService signatureService, UserContext userContext) 
        {
            SignatureService = signatureService;
            UserContext = userContext;
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

        [HttpPost]
        public async Task<IActionResult> ValidateAndSavePartnerKey(ValidateAndSavePartnerKeyRequest validateAndSavePartnerKeyRequest)
        {
            var response = await SignatureService.SavePartnerKey(validateAndSavePartnerKeyRequest, UserContext.GetPartnerId(User));
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> ValidateSignature(ValidateSignatureDTO validateSignatureDTO)
        {
            var response =  SignatureService.ValidateSignature(validateSignatureDTO.dataToSign,validateSignatureDTO.signatureToValidate, UserContext.GetPartnerId(User));
            return Ok(response);
        }
        [HttpPost]
        public async Task<IActionResult> GetSignature(GenerateSignatureDTO generateSignatureDTO)
        {
            var response =  SignatureService.GenerateSignature(UserContext.GetPartnerId(User), generateSignatureDTO.dataSign);
            return Ok(response);
        }

        [HttpPost]
        public async Task<KeyToSing> GetPartnerKeys()
        {
            var response = SignatureService.GetKeyToSing(UserContext.GetPartnerId(User));
            return response;
        }
        [HttpPost]
        public async Task<IActionResult> RemovePartnerKeys()
        {
            var response = await SignatureService.RemovePartnerKeys(UserContext.GetPartnerId(User));
            return Ok(response);
        }
    }
}
