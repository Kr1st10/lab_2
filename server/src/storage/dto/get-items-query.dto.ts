export type FileFilter = "all" | "image" | "video" | "music" | "document" | "other";

export class GetItemsQueryDto {
  search?: string;
  type?: FileFilter;
}
