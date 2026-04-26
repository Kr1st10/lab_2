import { ConfigService } from "@nestjs/config";
import type { TypeOrmModuleOptions } from "@nestjs/typeorm";

export function getDatabaseConfig(configService: ConfigService): TypeOrmModuleOptions {
  return {
    type: "postgres",
    host: configService.get<string>("DB_HOST", "localhost"),
    port: Number(configService.get<string>("DB_PORT", "5432")),
    username: configService.get<string>("DB_USERNAME", "postgres"),
    password: configService.get<string>("DB_PASSWORD", "postgres"),
    database: configService.get<string>("DB_DATABASE", "file_manager_lab"),
    entities: [],
    synchronize: true
  };
}
