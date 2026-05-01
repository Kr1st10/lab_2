import { Body, Controller, Get, Param, ParseIntPipe, Patch, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { GetItemsQueryDto } from "./dto/get-items-query.dto";
import { UpdateTextFileDto } from "./dto/update-text-file.dto";
import { StorageService } from "./storage.service";

@Controller("storage")
@ApiTags("storage")
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get("items")
  @ApiOperation({ summary: "Получить список файлов и папок" })
  getItems(@Query() query: GetItemsQueryDto) {
    return this.storageService.getItems(query);
  }

  @Get("folders/:id")
  @ApiOperation({ summary: "Получить информацию о папке" })
  getFolderById(@Param("id", ParseIntPipe) id: number) {
    return this.storageService.getFolderById(id);
  }

  @Get("folders/:id/items")
  @ApiOperation({ summary: "Получить содержимое папки" })
  getFolderItems(@Param("id", ParseIntPipe) id: number, @Query() query: GetItemsQueryDto) {
    return this.storageService.getFolderItems(id, query);
  }

  @Get("files/:id")
  @ApiOperation({ summary: "Получить информацию о файле" })
  getFileById(@Param("id", ParseIntPipe) id: number) {
    return this.storageService.getFileById(id);
  }

  @Patch("files/:id/content")
  @ApiOperation({ summary: "Сохранить новое содержимое текстового файла" })
  updateTextFileContent(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateTextFileDto) {
    return this.storageService.updateTextFileContent(id, dto);
  }
}
