using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccess.Mappers
{
    public class UserMapper : IEntityTypeConfiguration<UserEntity>
    {
        public void Configure(EntityTypeBuilder<UserEntity> builder)
        {
            builder.ToTable("Users");
            builder.Property(x => x.UserId).IsRequired();
            builder.Property(x => x.Username).IsRequired();
            builder.Property(x => x.Email).IsRequired();
            builder.Property(x => x.PartnerId).IsRequired();
            builder.Property(x => x.PasswordHash).IsRequired();
            builder.Property(x => x.FirstName).HasMaxLength(64).IsRequired(false);
            builder.Property(x => x.LastName).HasMaxLength(64).IsRequired(false);
            builder.Property(x => x.PhoneNumber).HasMaxLength(24).IsRequired(false);
            builder.Property(x => x.BirthDate).HasColumnType("datetime2").IsRequired(false);
        }
    }
}
