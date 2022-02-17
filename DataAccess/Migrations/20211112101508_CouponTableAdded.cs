using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace DataAccess.Migrations
{
    public partial class CouponTableAdded : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Code",
                table: "Transactions",
                newName: "CouponCode");

            migrationBuilder.CreateTable(
                name: "Coupons",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SerialNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PurchasedPartnerID = table.Column<int>(type: "int", nullable: false),
                    PurchasedAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PurchasedCurrency = table.Column<int>(type: "int", nullable: false),
                    PurchasedCountryIsoCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PurchasedOnUTC = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UsedOnPartnerID = table.Column<int>(type: "int", nullable: true),
                    UsedAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    UsedCurrency = table.Column<int>(type: "int", nullable: true),
                    UsedCountryIsoCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UsedOnUTC = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CancelledOnUTC = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Coupons", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Coupons_Partners_PurchasedPartnerID",
                        column: x => x.PurchasedPartnerID,
                        principalTable: "Partners",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Coupons_Partners_UsedOnPartnerID",
                        column: x => x.UsedOnPartnerID,
                        principalTable: "Partners",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Coupons_PurchasedPartnerID",
                table: "Coupons",
                column: "PurchasedPartnerID");

            migrationBuilder.CreateIndex(
                name: "IX_Coupons_UsedOnPartnerID",
                table: "Coupons",
                column: "UsedOnPartnerID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Coupons");

            migrationBuilder.RenameColumn(
                name: "CouponCode",
                table: "Transactions",
                newName: "Code");
        }
    }
}
