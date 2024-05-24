using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Partner
{
    public class Option
    {
        public List<Endpoint> Endpoints { get; set; }
        public List<KeyValuePair<int, string>> IntegrationTypeEnums { get; set; }
        public List<KeyValuePair<int, string>> AbonAuthorizationEnums { get; set; }
        public List<KeyValuePair<int, string>> AbonAmoutRuleEnums { get; set; }
        public List<KeyValuePair<int, string>> WithdrawalInstantEnums { get; set; }
    }
}
