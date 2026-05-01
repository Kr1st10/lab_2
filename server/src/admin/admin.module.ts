import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { TextFileChangeEntity } from "../storage/entities/text-file-change.entity";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([TextFileChangeEntity])],
  controllers: [AdminController],
  providers: [AdminService, JwtAuthGuard]
})
export class AdminModule {}
