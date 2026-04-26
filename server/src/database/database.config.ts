import { ConfigService } from "@nestjs/config";
import type { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { AdminEntity } from "../auth/entities/admin.entity";
import { FileEntity } from "../storage/entities/file.entity";
import { FolderEntity } from "../storage/entities/folder.entity";
import { TextFileChangeEntity } from "../storage/entities/text-file-change.entity";

export function getDatabaseConfig(configService: ConfigService): TypeOrmModuleOptions {
  return {
    type: "postgres",
    host: configService.get<string>("DB_HOST", "localhost"),
    port: Number(configService.get<string>("DB_PORT", "5432")),
    username: configService.get<string>("DB_USERNAME", "postgres"),
    password: configService.get<string>("DB_PASSWORD", "postgres"),
    database: configService.get<string>("DB_DATABASE", "file_manager_lab"),
    entities: [FolderEntity, FileEntity, TextFileChangeEntity, AdminEntity],
    synchronize: true
  };
}
