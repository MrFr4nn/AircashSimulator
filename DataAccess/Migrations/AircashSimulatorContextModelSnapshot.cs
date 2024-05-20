﻿// <auto-generated />
using System;
using DataAccess;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace DataAccess.Migrations
{
    [DbContext(typeof(AircashSimulatorContext))]
    partial class AircashSimulatorContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("ProductVersion", "5.0.11")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("Domain.Entities.CouponEntity", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime?>("CancelledOnUTC")
                        .HasColumnType("datetime2");

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("CouponCode")
                        .IsRequired()
                        .HasMaxLength(16)
                        .HasColumnType("nvarchar(16)");

                    b.Property<decimal>("PurchasedAmount")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");

                    b.Property<string>("PurchasedCountryIsoCode")
                        .IsRequired()
                        .HasMaxLength(2)
                        .HasColumnType("nvarchar(2)");

                    b.Property<int>("PurchasedCurrency")
                        .HasColumnType("int");

                    b.Property<DateTime>("PurchasedOnUTC")
                        .HasColumnType("datetime2");

                    b.Property<int>("PurchasedPartnerID")
                        .HasColumnType("int");

                    b.Property<string>("SerialNumber")
                        .IsRequired()
                        .HasMaxLength(16)
                        .HasColumnType("nvarchar(16)");

                    b.Property<decimal?>("UsedAmount")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");

                    b.Property<string>("UsedCountryIsoCode")
                        .HasMaxLength(2)
                        .HasColumnType("nvarchar(2)");

                    b.Property<int?>("UsedCurrency")
                        .HasColumnType("int");

                    b.Property<int?>("UsedOnPartnerID")
                        .HasColumnType("int");

                    b.Property<DateTime?>("UsedOnUTC")
                        .HasColumnType("datetime2");

                    b.Property<string>("UserId")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("ID");

                    b.HasIndex("PurchasedPartnerID");

                    b.HasIndex("UsedOnPartnerID");

                    b.ToTable("Coupons");
                });

            modelBuilder.Entity("Domain.Entities.EndpointEntity", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("EndpointType")
                        .HasColumnType("int");

                    b.Property<string>("Url")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Endpoints");
                });

            modelBuilder.Entity("Domain.Entities.ErrorCodeEntity", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("Code")
                        .HasColumnType("int");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("LocoKey")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<Guid>("PartnerId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("Id");

                    b.ToTable("ErrorCodes");
                });

            modelBuilder.Entity("Domain.Entities.IntegrationContactEntity", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Contact")
                        .IsRequired()
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<Guid>("PartnerId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("Id");

                    b.ToTable("IntegrationContacts");
                });

            modelBuilder.Entity("Domain.Entities.PartnerAbonDenominationsEntity", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<decimal>("Denomination")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");

                    b.Property<Guid>("PartnerId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("Id");

                    b.ToTable("PartnerAbonDenominations");
                });

            modelBuilder.Entity("Domain.Entities.PartnerEndpointUsageEntity", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("EndpointId")
                        .HasColumnType("int");

                    b.Property<Guid>("PartnerId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Request")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Response")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("PartnerEndpointsUsage");
                });

            modelBuilder.Entity("Domain.Entities.PartnerEntity", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("AbonAmountRule")
                        .HasColumnType("int");

                    b.Property<int>("AbonAuthorization")
                        .HasColumnType("int");

                    b.Property<int>("AbonType")
                        .HasColumnType("int");

                    b.Property<int>("AcPayType")
                        .HasColumnType("int");

                    b.Property<string>("Brand")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("CountryCode")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("CurrencyId")
                        .HasColumnType("int");

                    b.Property<int>("Environment")
                        .HasColumnType("int");

                    b.Property<string>("InternalTicket")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("MarketplacePosition")
                        .HasMaxLength(64)
                        .HasColumnType("nvarchar(64)");

                    b.Property<Guid>("PartnerId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("PartnerName")
                        .IsRequired()
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("Platform")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("PrivateKey")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PrivateKeyPass")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PublicKey")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("UseDefaultPartner")
                        .HasColumnType("bit");

                    b.Property<int>("WithdrawalInstant")
                        .HasColumnType("int");

                    b.Property<int>("WithdrawalType")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.ToTable("Partners");
                });

            modelBuilder.Entity("Domain.Entities.PartnerRoleEntity", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<Guid>("PartnerId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<int>("PartnerRole")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.ToTable("PartnerRoles");
                });

            modelBuilder.Entity("Domain.Entities.PartnerSettingsEntity", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("Key")
                        .HasColumnType("int");

                    b.Property<Guid>("PartnerId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Value")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("PartnerSettings");
                });

            modelBuilder.Entity("Domain.Entities.PreparedAircashFrameTransactionEntity", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<decimal>("Amount")
                        .HasColumnType("decimal(18,2)");

                    b.Property<string>("DeclineUrl")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("ISOCurrencyId")
                        .HasColumnType("int");

                    b.Property<string>("NotificationUrl")
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("PartnerId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("PartnerTransactionId")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("PayMethod")
                        .HasColumnType("int");

                    b.Property<int>("PayType")
                        .HasColumnType("int");

                    b.Property<DateTime?>("RequestDateTimeUTC")
                        .HasColumnType("datetime2");

                    b.Property<DateTime?>("ResponseDateTimeUTC")
                        .HasColumnType("datetime2");

                    b.Property<string>("SuccessUrl")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("TransactionSatus")
                        .HasColumnType("int");

                    b.Property<string>("UserId")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("PreparedAircashFrameTransactions");
                });

            modelBuilder.Entity("Domain.Entities.PreparedAircashPayTransactionEntity", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<decimal>("Amount")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("ISOCurrencyId")
                        .HasColumnType("int");

                    b.Property<string>("LocationId")
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("PartnerId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("PartnerTransactionId")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("RequestDateTimeUTC")
                        .HasColumnType("datetime2");

                    b.Property<DateTime?>("ResponseDateTimeUTC")
                        .HasColumnType("datetime2");

                    b.Property<int>("Status")
                        .HasColumnType("int");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("ValidForPeriod")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.ToTable("PreparedAircashPayTransactions");
                });

            modelBuilder.Entity("Domain.Entities.SettingEntity", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Key")
                        .IsRequired()
                        .HasMaxLength(128)
                        .HasColumnType("nvarchar(128)");

                    b.Property<string>("Value")
                        .IsRequired()
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");

                    b.HasKey("Id");

                    b.ToTable("Settings");
                });

            modelBuilder.Entity("Domain.Entities.TransactionEntity", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("AircashTransactionId")
                        .HasColumnType("nvarchar(max)");

                    b.Property<decimal>("Amount")
                        .HasPrecision(18, 2)
                        .HasColumnType("decimal(18,2)");

                    b.Property<int>("ISOCurrencyId")
                        .HasColumnType("int");

                    b.Property<Guid>("PartnerId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("PointOfSaleId")
                        .HasMaxLength(128)
                        .HasColumnType("nvarchar(128)");

                    b.Property<DateTime?>("RequestDateTimeUTC")
                        .HasColumnType("datetime2");

                    b.Property<DateTime?>("ResponseDateTimeUTC")
                        .HasColumnType("datetime2");

                    b.Property<int>("ServiceId")
                        .HasColumnType("int");

                    b.Property<string>("TransactionId")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Transactions");
                });

            modelBuilder.Entity("Domain.Entities.UserEntity", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime?>("BirthDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Environment")
                        .HasColumnType("int");

                    b.Property<string>("FirstName")
                        .HasMaxLength(64)
                        .HasColumnType("nvarchar(64)");

                    b.Property<string>("LastName")
                        .HasMaxLength(64)
                        .HasColumnType("nvarchar(64)");

                    b.Property<Guid>("PartnerId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("PasswordHash")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PhoneNumber")
                        .HasMaxLength(24)
                        .HasColumnType("nvarchar(24)");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("Domain.Entities.CouponEntity", b =>
                {
                    b.HasOne("Domain.Entities.PartnerEntity", "PurchasedPartner")
                        .WithMany()
                        .HasForeignKey("PurchasedPartnerID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Domain.Entities.PartnerEntity", "UsedOnPartner")
                        .WithMany()
                        .HasForeignKey("UsedOnPartnerID");

                    b.Navigation("PurchasedPartner");

                    b.Navigation("UsedOnPartner");
                });
#pragma warning restore 612, 618
        }
    }
}
