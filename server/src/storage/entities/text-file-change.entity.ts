import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "text_file_changes" })
export class TextFileChangeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fileId: number;

  @Column()
  fileName: string;

  @Column({ type: "text" })
  newContent: string;

  @Column({ type: "timestamp" })
  changedAt: Date;
}
