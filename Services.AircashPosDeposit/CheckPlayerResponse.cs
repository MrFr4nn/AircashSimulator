using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Services.AircashPosDeposit
{
    public class CheckPlayerResponse
    {
        public bool IsPlayer { get; set; }
        public ResponseError Error { get; set; }
        public List<CheckPlayerParameter> Parameters { get; set; }
    }

    public class CheckPlayerParameter
    {
        public string Key { get; set; }
        public string Type { get; set; }
        public string Value { get; set; }
    }
}
