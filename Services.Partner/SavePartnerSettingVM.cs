using Domain.Entities.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Partner
{
    public class SavePartnerSettingVM
    {
        public Guid PartnerId { get; set; }
        public List<SavePartnerDTO> NewPartnerSetting { get; set; }
    }
    public class SavePartnerDTO
    {
        public Guid PartnerId { get; set; }
        public int settingId { get; set;}
        public string input { get; set; }
    }
}
