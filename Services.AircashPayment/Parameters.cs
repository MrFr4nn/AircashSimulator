using System.Text.Json.Serialization;

namespace Services.AircashPayment
{
    public class Parameters
    {
        public string Key { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string Type { get; set; }
        public string Value { get; set; }
    }
}
