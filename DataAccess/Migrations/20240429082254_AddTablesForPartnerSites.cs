using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace DataAccess.Migrations
{
    public partial class AddTablesForPartnerSites : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AbonAmountRule",
                table: "Partners",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "AbonAuthorization",
                table: "Partners",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "AbonType",
                table: "Partners",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "AcPayType",
                table: "Partners",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Brand",
                table: "Partners",
                type: "nvarchar(256)",
                maxLength: 256,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "InternalTicket",
                table: "Partners",
                type: "nvarchar(256)",
                maxLength: 256,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MarketplacePosition",
                table: "Partners",
                type: "nvarchar(64)",
                maxLength: 64,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Platform",
                table: "Partners",
                type: "nvarchar(256)",
                maxLength: 256,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "WithdrawalInstant",
                table: "Partners",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "WithdrawalType",
                table: "Partners",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "ErrorCodes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PartnerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Code = table.Column<int>(type: "int", nullable: false),
                    LocoKey = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ErrorCodes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "IntegrationContacts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PartnerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Contact = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IntegrationContacts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PartnerEndpointsUsage",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PartnerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    Url = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    Body = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PartnerEndpointsUsage", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ErrorCodes");

            migrationBuilder.DropTable(
                name: "IntegrationContacts");

            migrationBuilder.DropTable(
                name: "PartnerEndpointsUsage");

            migrationBuilder.DropColumn(
                name: "AbonAmountRule",
                table: "Partners");

            migrationBuilder.DropColumn(
                name: "AbonAuthorization",
                table: "Partners");

            migrationBuilder.DropColumn(
                name: "AbonType",
                table: "Partners");

            migrationBuilder.DropColumn(
                name: "AcPayType",
                table: "Partners");

            migrationBuilder.DropColumn(
                name: "Brand",
                table: "Partners");

            migrationBuilder.DropColumn(
                name: "InternalTicket",
                table: "Partners");

            migrationBuilder.DropColumn(
                name: "MarketplacePosition",
                table: "Partners");

            migrationBuilder.DropColumn(
                name: "Platform",
                table: "Partners");

            migrationBuilder.DropColumn(
                name: "WithdrawalInstant",
                table: "Partners");

            migrationBuilder.DropColumn(
                name: "WithdrawalType",
                table: "Partners");
        }
    }
}
