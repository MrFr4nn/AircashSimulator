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
    public class PartnerAbonDenominationsMapper : IEntityTypeConfiguration<PartnerAbonDenominationsEntity>
    {
        public void Configure(EntityTypeBuilder<PartnerAbonDenominationsEntity> builder)
        {
            builder.ToTable("PartnerAbonDenominations");
            builder.Property(x => x.PartnerId).IsRequired();
            builder.Property(x => x.Denomination).IsRequired().HasPrecision(18, 2);
        }
    }
}
