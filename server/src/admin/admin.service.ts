import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TextFileChangeEntity } from "../storage/entities/text-file-change.entity";

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(TextFileChangeEntity)
    private readonly textFileChangesRepository: Repository<TextFileChangeEntity>
  ) {}

  getTextFileChanges(): Promise<TextFileChangeEntity[]> {
    return this.textFileChangesRepository.find({
      order: {
        changedAt: "DESC"
      }
    });
  }
}
