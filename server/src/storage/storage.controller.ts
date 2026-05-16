import { Body, Controller, Get, Param, ParseIntPipe, Patch, Query } from "@nestjs/common";
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { GetItemsQueryDto } from "./dto/get-items-query.dto";
import { UpdateTextFileDto } from "./dto/update-text-file.dto";
import { StorageService } from "./storage.service";

@Controller("storage")
@ApiTags("storage")
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get("items")
  @ApiOperation({ summary: "Получить список файлов и папок" })
  @ApiOkResponse({ description: "Список файлов и папок успешно получен" })
  @ApiBadRequestResponse({ description: "Переданы некорректные параметры поиска или фильтрации" })
  getItems(@Query() query: GetItemsQueryDto) {
    return this.storageService.getItems(query);
  }

  @Get("folders/:id")
  @ApiOperation({ summary: "Получить информацию о папке" })
  @ApiOkResponse({ description: "Информация о папке успешно получена" })
  @ApiBadRequestResponse({ description: "ID папки должен быть числом" })
  @ApiNotFoundResponse({ description: "Папка не найдена" })
  getFolderById(@Param("id", ParseIntPipe) id: number) {
    return this.storageService.getFolderById(id);
  }

  @Get("folders/:id/items")
  @ApiOperation({ summary: "Получить содержимое папки" })
  @ApiOkResponse({ description: "Содержимое папки успешно получено" })
  @ApiBadRequestResponse({ description: "Переданы некорректные параметры запроса" })
  @ApiNotFoundResponse({ description: "Папка не найдена" })
  getFolderItems(@Param("id", ParseIntPipe) id: number, @Query() query: GetItemsQueryDto) {
    return this.storageService.getFolderItems(id, query);
  }

  @Get("files/:id")
  @ApiOperation({ summary: "Получить информацию о файле" })
  @ApiOkResponse({ description: "Информация о файле успешно получена" })
  @ApiBadRequestResponse({ description: "ID файла должен быть числом" })
  @ApiNotFoundResponse({ description: "Файл не найден" })
  getFileById(@Param("id", ParseIntPipe) id: number) {
    return this.storageService.getFileById(id);
  }

  @Patch("files/:id/content")
  @ApiOperation({ summary: "Сохранить новое содержимое текстового файла" })
  @ApiOkResponse({ description: "Текстовый файл успешно обновлен" })
  @ApiBadRequestResponse({ description: "Переданы некорректные данные или файл не является текстовым" })
  @ApiNotFoundResponse({ description: "Файл не найден" })
  updateTextFileContent(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateTextFileDto) {
    return this.storageService.updateTextFileContent(id, dto);
  }
}
