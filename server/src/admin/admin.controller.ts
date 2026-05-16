import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { AdminService } from "./admin.service";

@Controller("admin")
@UseGuards(JwtAuthGuard)
@ApiTags("admin")
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("text-file-changes")
  @ApiOperation({ summary: "Получить изменения текстовых файлов для админ-панели" })
  @ApiOkResponse({ description: "Список изменений текстовых файлов успешно получен" })
  @ApiUnauthorizedResponse({ description: "Bearer-токен не передан, неверен или истек" })
  getTextFileChanges() {
    return this.adminService.getTextFileChanges();
  }
}
