import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, In, IsNull, Repository } from "typeorm";
import { GetItemsQueryDto } from "./dto/get-items-query.dto";
import { UpdateTextFileDto } from "./dto/update-text-file.dto";
import { FileEntity, FileType } from "./entities/file.entity";
import { FolderEntity } from "./entities/folder.entity";
import { TextFileChangeEntity } from "./entities/text-file-change.entity";

type StorageItem = FolderEntity | FileEntity;

@Injectable()
export class StorageService {
  constructor(
    @InjectRepository(FolderEntity)
    private readonly foldersRepository: Repository<FolderEntity>,
    @InjectRepository(FileEntity)
    private readonly filesRepository: Repository<FileEntity>,
    @InjectRepository(TextFileChangeEntity)
    private readonly textFileChangesRepository: Repository<TextFileChangeEntity>
  ) {}

  async getItems(query: GetItemsQueryDto): Promise<StorageItem[]> {
    const search = query.search?.trim() ?? "";
    const type = query.type ?? "all";
    const isGlobalSearch = search !== "" || type !== "all";
    const folderWhere = isGlobalSearch ? this.getNameWhere(search) : { folderId: IsNull() };
    const fileWhere = this.getFileWhere(search, type, isGlobalSearch ? undefined : null);

    const [folders, files] = await Promise.all([
      type === "all" ? this.foldersRepository.find({ where: folderWhere }) : Promise.resolve([]),
      this.filesRepository.find({ where: fileWhere })
    ]);

    return this.sortItems([...folders, ...files]);
  }

  async getFolderById(id: number): Promise<FolderEntity> {
    const folder = await this.foldersRepository.findOne({ where: { id } });

    if (!folder) {
      throw new NotFoundException("Папка не найдена");
    }

    return folder;
  }

  async getFolderItems(folderId: number, query: GetItemsQueryDto): Promise<StorageItem[]> {
    await this.getFolderById(folderId);

    const search = query.search?.trim() ?? "";
    const type = query.type ?? "all";
    const folderWhere = search === "" ? { folderId } : { folderId, name: ILike(`%${search}%`) };
    const fileWhere = this.getFileWhere(search, type, folderId);

    const [folders, files] = await Promise.all([
      type === "all" ? this.foldersRepository.find({ where: folderWhere }) : Promise.resolve([]),
      this.filesRepository.find({ where: fileWhere })
    ]);

    return this.sortItems([...folders, ...files]);
  }

  async getFileById(id: number): Promise<FileEntity> {
    const file = await this.filesRepository.findOne({ where: { id } });

    if (!file) {
      throw new NotFoundException("Файл не найден");
    }

    return file;
  }

  async updateTextFileContent(id: number, dto: UpdateTextFileDto): Promise<FileEntity> {
    const file = await this.getFileById(id);

    if (file.fileType !== FileType.Text) {
      throw new BadRequestException("Редактировать можно только текстовые файлы");
    }

    const updatedAt = new Date();
    const content = dto.content;

    file.content = content;
    file.size = Buffer.byteLength(content, "utf8");
    file.updatedAt = updatedAt;

    const updatedFile = await this.filesRepository.save(file);

    await this.textFileChangesRepository.save({
      fileId: updatedFile.id,
      fileName: updatedFile.name,
      newContent: content,
      changedAt: updatedAt
    });

    return updatedFile;
  }

  private getNameWhere(search: string) {
    return search === "" ? {} : { name: ILike(`%${search}%`) };
  }

  private getFileWhere(search: string, type: string, folderId?: number | null) {
    const where: Record<string, unknown> = this.getNameWhere(search);
    const fileTypes = this.getFileTypesByFilter(type);

    if (folderId !== undefined) {
      where.folderId = folderId === null ? IsNull() : folderId;
    }

    if (fileTypes.length > 0) {
      where.fileType = fileTypes.length === 1 ? fileTypes[0] : In(fileTypes);
    }

    return where;
  }

  private getFileTypesByFilter(type: string): FileType[] {
    switch (type) {
      case "image":
        return [FileType.Image];
      case "video":
        return [FileType.Video];
      case "music":
        return [FileType.Audio];
      case "document":
        return [FileType.Text, FileType.Pdf, FileType.Document];
      case "other":
        return [FileType.Other];
      default:
        return [];
    }
  }

  private sortItems(items: StorageItem[]): StorageItem[] {
    return [...items].sort((left, right) => {
      if (left.kind !== right.kind) {
        return left.kind === "folder" ? -1 : 1;
      }

      return left.name.localeCompare(right.name, "ru");
    });
  }
}
