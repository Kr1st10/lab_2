import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FileEntity } from "./entities/file.entity";
import { FolderEntity } from "./entities/folder.entity";
import { TextFileChangeEntity } from "./entities/text-file-change.entity";
import { StorageController } from "./storage.controller";
import { StorageService } from "./storage.service";

@Module({
  imports: [TypeOrmModule.forFeature([FolderEntity, FileEntity, TextFileChangeEntity])],
  controllers: [StorageController],
  providers: [StorageService]
})
export class StorageModule {}
