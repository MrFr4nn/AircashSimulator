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
    class PreparedAircashTransactionMapper : IEntityTypeConfiguration<PreparedAircashTransactionEntity>
    {
        public void Configure(EntityTypeBuilder<PreparedAircashTransactionEntity> builder)
        {
            builder.ToTable("PreparedAircashTransactions");
            builder.Property(x => x.PartnerId).IsRequired();
            builder.Property(x => x.Amount).HasPrecision(18, 2).IsRequired();
            builder.Property(x => x.ISOCurrencyId).IsRequired();
            builder.Property(x => x.PartnerTransactionId).IsRequired();
            builder.Property(x => x.Description).IsRequired(false);
            builder.Property(x => x.ValidForPeriod).IsRequired(false);
            builder.Property(x => x.LocationId).IsRequired(false);
            builder.Property(x => x.UserId).IsRequired(true);
            builder.Property(x => x.Status).IsRequired(true);
            builder.Property(x => x.RequestDateTimeUTC).HasColumnType("datetime2").IsRequired(false);
            builder.Property(x => x.ResponseDateTimeUTC).HasColumnType("datetime2").IsRequired(false);
        }
    }
}
