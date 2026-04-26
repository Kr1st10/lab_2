import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { getDatabaseConfig } from "./database/database.config";
import { StorageModule } from "./storage/storage.module";

@Module({
  imports: [
    // 
    // читаем env. 
    // forRoot используется для первичной настройки модуля конфигурации, 
    // а isGlobal: true делает ConfigService доступным во всем приложении 
    // без повторного импорта ConfigModule в каждом модуле
    ConfigModule.forRoot({ 
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getDatabaseConfig
    }),
    StorageModule
  ]
})
export class AppModule {}
