using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Mappers
{
    public class CouponMapper : IEntityTypeConfiguration<CouponEntity>
    {
        public void Configure(EntityTypeBuilder<CouponEntity> builder)
        {
            builder.ToTable("Coupons");
            builder.Property(x => x.SerialNumber).IsRequired().HasMaxLength(16);
            builder.Property(x => x.PurchasedPartnerID).IsRequired().HasColumnType("int");
            builder.Property(x => x.PurchasedAmount).HasPrecision(18, 2).IsRequired();
            builder.Property(x => x.PurchasedCurrency).IsRequired();
            builder.Property(x => x.PurchasedCountryIsoCode).IsRequired().HasMaxLength(2);
            builder.Property(x => x.PurchasedOnUTC).HasColumnType("datetime2").IsRequired();
            builder.Property(x => x.UsedOnPartnerID).IsRequired(false);
            builder.Property(x => x.UsedAmount).IsRequired(false).HasPrecision(18, 2);
            builder.Property(x => x.UsedCurrency).IsRequired(false);
            builder.Property(x => x.UsedCountryIsoCode).IsRequired(false).HasMaxLength(2);
            builder.Property(x => x.UsedOnUTC).HasColumnType("datetime2").IsRequired(false);
            builder.Property(x => x.UserId).IsRequired(false);
            builder.Property(x => x.CancelledOnUTC).HasColumnType("datetime2").IsRequired(false);
            builder.Property(x => x.Content).IsRequired();
            builder.Property(x => x.CouponCode).IsRequired().HasMaxLength(16);
        }
    }
}
