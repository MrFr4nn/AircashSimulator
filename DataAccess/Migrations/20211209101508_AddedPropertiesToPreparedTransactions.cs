using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace DataAccess.Migrations
{
    public partial class AddedPropertiesToPreparedTransactions : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "RequestDateTimeUTC",
                table: "PreparedAircashTransactions",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ResponseDateTimeUTC",
                table: "PreparedAircashTransactions",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "PreparedAircashTransactions",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RequestDateTimeUTC",
                table: "PreparedAircashTransactions");

            migrationBuilder.DropColumn(
                name: "ResponseDateTimeUTC",
                table: "PreparedAircashTransactions");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "PreparedAircashTransactions");
        }
    }
}
