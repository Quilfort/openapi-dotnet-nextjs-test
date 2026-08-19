using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddDepartmentAndUserToAgendaTask : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "department_id",
                table: "agenda_tasks",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "user_id",
                table: "agenda_tasks",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_agenda_tasks_department_id",
                table: "agenda_tasks",
                column: "department_id");

            migrationBuilder.CreateIndex(
                name: "IX_agenda_tasks_user_id",
                table: "agenda_tasks",
                column: "user_id");

            migrationBuilder.AddForeignKey(
                name: "FK_agenda_tasks_departments_department_id",
                table: "agenda_tasks",
                column: "department_id",
                principalTable: "departments",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_agenda_tasks_users_user_id",
                table: "agenda_tasks",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_agenda_tasks_departments_department_id",
                table: "agenda_tasks");

            migrationBuilder.DropForeignKey(
                name: "FK_agenda_tasks_users_user_id",
                table: "agenda_tasks");

            migrationBuilder.DropIndex(
                name: "IX_agenda_tasks_department_id",
                table: "agenda_tasks");

            migrationBuilder.DropIndex(
                name: "IX_agenda_tasks_user_id",
                table: "agenda_tasks");

            migrationBuilder.DropColumn(
                name: "department_id",
                table: "agenda_tasks");

            migrationBuilder.DropColumn(
                name: "user_id",
                table: "agenda_tasks");
        }
    }
}
