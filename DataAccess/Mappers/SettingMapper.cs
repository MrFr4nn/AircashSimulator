using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccess.Mappers
{
    public class SettingMapper : IEntityTypeConfiguration<SettingEntity>
    {
        public void Configure(EntityTypeBuilder<SettingEntity> builder)
        {
            builder.ToTable("Settings");
            builder.Property(x => x.Key).IsRequired().HasMaxLength(128);
            builder.Property(x => x.Value).IsRequired().HasMaxLength(500);
        }
    }
}
