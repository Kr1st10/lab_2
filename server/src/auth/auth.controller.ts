import { Body, Controller, Post } from "@nestjs/common";
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";

@Controller("auth")
@ApiTags("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @ApiOperation({ summary: "Войти как администратор и получить access token" })
  @ApiOkResponse({ description: "Вход выполнен успешно, access token выдан" })
  @ApiBadRequestResponse({ description: "Переданы некорректные данные входа" })
  @ApiUnauthorizedResponse({ description: "Неверный логин или пароль" })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
