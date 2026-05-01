import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpdateTextFileDto {
  @ApiProperty({
    description: "Новое содержимое текстового файла",
    example: "Обновленный текст файла"
  })
  @IsString()
  content: string;
}
