import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum FileType {
  Text = "text",
  Pdf = "pdf",
  Image = "image",
  Video = "video",
  Audio = "audio",
  Document = "document",
  Other = "other"
}

@Entity({ name: "files" })
export class FileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: "file" })
  kind: "file";

  @Column({
    type: "enum",
    enum: FileType
  })
  fileType: FileType;

  @Column()
  extension: string;

  @Column()
  size: number;

  @Column()
  path: string;

  @Column({ type: "timestamptz" })
  updatedAt: Date;

  @Column({ type: "text", nullable: true })
  content: string | null;

  @Column({ type: "varchar", nullable: true })
  url: string | null;

  @Column({ type: "integer", nullable: true })
  folderId: number | null;
}
