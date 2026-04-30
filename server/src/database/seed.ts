import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NestFactory } from "@nestjs/core";
import { getRepositoryToken } from "@nestjs/typeorm";
import * as bcrypt from "bcryptjs";
import { Repository } from "typeorm";
import { AppModule } from "../app.module";
import { AdminEntity } from "../auth/entities/admin.entity";
import { FileEntity } from "../storage/entities/file.entity";
import { FolderEntity } from "../storage/entities/folder.entity";
import { TextFileChangeEntity } from "../storage/entities/text-file-change.entity";

type DbJson = {
  folders: FolderEntity[];
  files: Array<Omit<FileEntity, "updatedAt"> & { updatedAt: string }>;
};

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const foldersRepository = app.get<Repository<FolderEntity>>(getRepositoryToken(FolderEntity));
  const filesRepository = app.get<Repository<FileEntity>>(getRepositoryToken(FileEntity));
  const adminsRepository = app.get<Repository<AdminEntity>>(getRepositoryToken(AdminEntity));
  const changesRepository = app.get<Repository<TextFileChangeEntity>>(getRepositoryToken(TextFileChangeEntity));

  const dbPath = join(__dirname, "../../../db.json");
  const dbFile = await readFile(dbPath, "utf8");
  const db = JSON.parse(dbFile) as DbJson;

  await changesRepository.clear();
  await filesRepository.clear();
  await foldersRepository.clear();
  await adminsRepository.clear();

  await foldersRepository.save(db.folders);
  await filesRepository.save(
    db.files.map((file) => ({
      ...file,
      updatedAt: new Date(file.updatedAt)
    }))
  );

  const passwordHash = await bcrypt.hash("admin123", 10);

  await adminsRepository.save({
    login: "admin",
    passwordHash
  });

  await app.close();
}

void seed();
