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
        public PartnerSettingsRoleEnum Role { get; set; }
        public int Version {get; set; }
        public string Parameteres { get; set; }
    }
}
