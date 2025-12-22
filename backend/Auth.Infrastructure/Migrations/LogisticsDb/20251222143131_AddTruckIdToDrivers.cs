using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Auth.Infrastructure.Migrations.LogisticsDb
{
    /// <inheritdoc />
    public partial class AddTruckIdToDrivers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "Trucks");

            migrationBuilder.DropColumn(
                name: "AssignedTruckId",
                table: "Drivers");

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Trucks",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<Guid>(
                name: "TruckId",
                table: "Drivers",
                type: "uuid",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Trucks");

            migrationBuilder.DropColumn(
                name: "TruckId",
                table: "Drivers");

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Trucks",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "AssignedTruckId",
                table: "Drivers",
                type: "text",
                nullable: true);
        }
    }
}
