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
            builder.Property(x => x.Brand).HasMaxLength(256);
            builder.Property(x => x.Platform).HasMaxLength(256);
            builder.Property(x => x.InternalTicket).HasMaxLength(256);
            builder.Property(x => x.MarketplacePosition).HasMaxLength(64);
            builder.Property(x => x.Confluence).HasMaxLength(256);
        }
    }
}
