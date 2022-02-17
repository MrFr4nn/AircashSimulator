using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccess.Mappers
{
    public class TransactionMapper : IEntityTypeConfiguration<TransactionEntity>
    {
        public void Configure(EntityTypeBuilder<TransactionEntity> builder)
        {
            builder.ToTable("Transactions");
            builder.Property(x => x.Amount).HasPrecision(18, 2).IsRequired();
            builder.Property(x => x.ISOCurrencyId).IsRequired();
            //builder.Property(x => x.CouponCode).IsRequired().HasMaxLength(16);
            builder.Property(x => x.PartnerId).IsRequired();
            builder.Property(x => x.TransactionId).IsRequired();
            builder.Property(x => x.RequestDateTimeUTC).HasColumnType("datetime2").IsRequired(false);
            builder.Property(x => x.ResponseDateTimeUTC).HasColumnType("datetime2").IsRequired(false);
            builder.Property(x => x.ServiceId).IsRequired();
            builder.Property(x => x.UserId).IsRequired();
            builder.Property(x => x.PointOfSaleId).HasMaxLength(128);
        }
    }
}
