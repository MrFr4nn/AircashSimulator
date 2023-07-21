using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace CrossCutting
{
    public class HelperService : IHelperService
    {
        private static Random random = new Random();
        public string RandomNumber(int length)
        {
            const string chars = "0123456789";
            return new string(Enumerable.Repeat(chars, length)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        public string GetCurl(object request,string endpoint)
        {
            return "curl -X POST -H \"Content-Type: application/json\"  -d " + JsonConvert.SerializeObject(JsonConvert.SerializeObject(request)) + " " + endpoint;
        }
    }
}
