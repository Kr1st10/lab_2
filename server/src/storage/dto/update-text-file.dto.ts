import { IsString } from "class-validator";

export class UpdateTextFileDto {
  @IsString()
  content: string;
}
