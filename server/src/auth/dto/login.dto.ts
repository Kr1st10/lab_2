import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class LoginDto {
  @ApiProperty({
    description: "Логин администратора",
    example: "admin"
  })
  @IsString()
  login: string;

  @ApiProperty({
    description: "Пароль администратора",
    example: "admin123"
  })
  @IsString()
  @MinLength(6)
  password: string;
}
