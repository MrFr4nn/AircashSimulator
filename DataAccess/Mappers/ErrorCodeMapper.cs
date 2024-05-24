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
    public class ErrorCodeMapper : IEntityTypeConfiguration<ErrorCodeEntity>
    {
        public void Configure(EntityTypeBuilder<ErrorCodeEntity> builder)
        {
            builder.ToTable("ErrorCodes");
            builder.Property(x => x.PartnerId).IsRequired();
            builder.Property(x => x.Code).IsRequired();
            builder.Property(x => x.LocoKey).HasMaxLength(256);
        }
    }
}
