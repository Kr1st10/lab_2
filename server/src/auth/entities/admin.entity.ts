import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "admins" })
export class AdminEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  login: string;

  @Column()
  passwordHash: string;
}
