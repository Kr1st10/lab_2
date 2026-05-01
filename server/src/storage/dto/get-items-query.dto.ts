import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsIn, IsOptional, IsString } from "class-validator";

export type FileFilter = "all" | "image" | "video" | "music" | "document" | "other";

const fileFilters: FileFilter[] = ["all", "image", "video", "music", "document", "other"];

export class GetItemsQueryDto {
  @ApiPropertyOptional({
    description: "Строка поиска по названию файла или папки",
    example: "report"
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: "Фильтр по виду файла",
    enum: fileFilters,
    example: "document"
  })
  @IsOptional()
  @IsIn(fileFilters)
  type?: FileFilter;
}
