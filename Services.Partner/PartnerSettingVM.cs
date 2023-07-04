using Domain.Entities.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Partner
{
    public class PartnerSettingVM
    {
        public int Id { get; set; }
        public Guid? PartnerId { get; set; }
        public PartnerSettingEnum Key { get; set; }
        public string Value { get; set; }
    }
    public class SettingRoles
    {
        public PartnerSettingEnum SettingId { get; set; }
        public string SettingName { get; set; }
    }
}
