import { Body, Controller, Get, Param, ParseIntPipe, Patch, Query } from "@nestjs/common";
import { GetItemsQueryDto } from "./dto/get-items-query.dto";
import { UpdateTextFileDto } from "./dto/update-text-file.dto";
import { StorageService } from "./storage.service";

@Controller("storage")
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get("items")
  getItems(@Query() query: GetItemsQueryDto) {
    return this.storageService.getItems(query);
  }

  @Get("folders/:id")
  getFolderById(@Param("id", ParseIntPipe) id: number) {
    return this.storageService.getFolderById(id);
  }

  @Get("folders/:id/items")
  getFolderItems(@Param("id", ParseIntPipe) id: number, @Query() query: GetItemsQueryDto) {
    return this.storageService.getFolderItems(id, query);
  }

  @Get("files/:id")
  getFileById(@Param("id", ParseIntPipe) id: number) {
    return this.storageService.getFileById(id);
  }

  @Patch("files/:id/content")
  updateTextFileContent(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateTextFileDto) {
    return this.storageService.updateTextFileContent(id, dto);
  }
}
