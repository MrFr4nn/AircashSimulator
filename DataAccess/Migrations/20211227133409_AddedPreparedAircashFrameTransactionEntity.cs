using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace DataAccess.Migrations
{
    public partial class AddedPreparedAircashFrameTransactionEntity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PreparedAircashFrameTransactions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PartnerTransactionId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PartnerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ISOCurrencyId = table.Column<int>(type: "int", nullable: false),
                    PayType = table.Column<int>(type: "int", nullable: false),
                    PayMethod = table.Column<int>(type: "int", nullable: false),
                    NotificationUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SuccessUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DeclineUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RequestDateTimeUTC = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ResponseDateTimeUTC = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PreparedAircashFrameTransactions", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PreparedAircashFrameTransactions");
        }
    }
}
