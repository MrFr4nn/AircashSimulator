using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Signature
{
    public class ValidateAndSavePartnerKeyRequest
    {
        public string PrivateKey { get; set; }
        public string PublicKey { get; set; }
        public string Password { get; set; }
    }
}
