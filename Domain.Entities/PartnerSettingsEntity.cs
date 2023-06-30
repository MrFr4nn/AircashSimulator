using System;
using System.ComponentModel.DataAnnotations;
using Domain.Entities.Enum;
namespace Domain.Entities
{
    public class PartnerSettingsEntity
    {
        [Key]
        public int Id { get; set; }
        public Guid PartnerId { get; set; }
        public PartnerSettingsRoleEnum Key { get; set; }
        public string Value { get; set; }
    }
}
