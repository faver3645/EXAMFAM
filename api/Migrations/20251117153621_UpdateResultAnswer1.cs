using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateResultAnswer1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_QuizResultAnswer_UserQuizResults_QuizResultId",
                table: "QuizResultAnswer");

            migrationBuilder.DropPrimaryKey(
                name: "PK_QuizResultAnswer",
                table: "QuizResultAnswer");

            migrationBuilder.RenameTable(
                name: "QuizResultAnswer",
                newName: "QuizResultAnswers");

            migrationBuilder.RenameIndex(
                name: "IX_QuizResultAnswer_QuizResultId",
                table: "QuizResultAnswers",
                newName: "IX_QuizResultAnswers_QuizResultId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_QuizResultAnswers",
                table: "QuizResultAnswers",
                column: "QuizResultAnswerId");

            migrationBuilder.AddForeignKey(
                name: "FK_QuizResultAnswers_UserQuizResults_QuizResultId",
                table: "QuizResultAnswers",
                column: "QuizResultId",
                principalTable: "UserQuizResults",
                principalColumn: "QuizResultId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_QuizResultAnswers_UserQuizResults_QuizResultId",
                table: "QuizResultAnswers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_QuizResultAnswers",
                table: "QuizResultAnswers");

            migrationBuilder.RenameTable(
                name: "QuizResultAnswers",
                newName: "QuizResultAnswer");

            migrationBuilder.RenameIndex(
                name: "IX_QuizResultAnswers_QuizResultId",
                table: "QuizResultAnswer",
                newName: "IX_QuizResultAnswer_QuizResultId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_QuizResultAnswer",
                table: "QuizResultAnswer",
                column: "QuizResultAnswerId");

            migrationBuilder.AddForeignKey(
                name: "FK_QuizResultAnswer_UserQuizResults_QuizResultId",
                table: "QuizResultAnswer",
                column: "QuizResultId",
                principalTable: "UserQuizResults",
                principalColumn: "QuizResultId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
