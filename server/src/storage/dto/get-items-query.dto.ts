import { IsIn, IsOptional, IsString } from "class-validator";

export type FileFilter = "all" | "image" | "video" | "music" | "document" | "other";

const fileFilters: FileFilter[] = ["all", "image", "video", "music", "document", "other"];

export class GetItemsQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn(fileFilters)
  type?: FileFilter;
}
