import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "folders" })
export class FolderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: "folder" })
  kind: "folder";

  @Column()
  path: string;

  @Column({ nullable: true })
  folderId: number | null;
}
