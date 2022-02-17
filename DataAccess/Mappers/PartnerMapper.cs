using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccess.Mappers
{
    public class PartnerMapper : IEntityTypeConfiguration<PartnerEntity>
    {
        public void Configure(EntityTypeBuilder<PartnerEntity> builder)
        {
            builder.ToTable("Partners");
            builder.Property(x => x.PartnerId).IsRequired();
            builder.Property(x => x.PartnerName).IsRequired().HasMaxLength(256);
            builder.Property(x => x.PrivateKey).IsRequired();
            builder.Property(x => x.PrivateKeyPass).IsRequired();
            builder.Property(x => x.CurrencyId).IsRequired();
            builder.Property(x => x.CountryCode).IsRequired();
        }
    }
}
