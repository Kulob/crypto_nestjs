import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import configuration from './configuration';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './modules/user/models/user.model';
import { AuthModule } from './modules/auth/auth.module';
import { TokenModule } from './token/token.module';
import { WatchlistModule } from './modules/watchlist/watchlist.module';
import { Watchlist } from './modules/watchlist/models/watchlist.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal:true,
    load: [configuration]
  }),
  SequelizeModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      dialect: "postgres",
      host: configService.get('db_host'),
      port: configService.get('db_port'),
      username: configService.get('db_user'),
      password: configService.get('db_password'),
      database: configService.get('db_name'),
      synchronize: true,
      autoLoadModels: true,
      models: [User, Watchlist]
    })
  }), 
  UserModule,
  AuthModule,
  TokenModule,
  WatchlistModule
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
