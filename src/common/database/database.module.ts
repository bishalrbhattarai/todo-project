import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  InjectConnection,
  ModelDefinition,
  MongooseModule,
} from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (ConfigService: ConfigService) => ({
        uri: ConfigService.get<string>('DATABASE_URI'),
      }),
    }),
  ],
})
export class DatabaseModule implements OnModuleInit {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  static forFeature(models: ModelDefinition[]) {
    return MongooseModule.forFeature(models);
  }

  onModuleInit() {
    switch (this.connection.readyState) {
      case 0:
        console.log('Mongoose connection is disconnected');
        break;
      case 1:
        console.log('Mongoose connection is connected');
        break;
      case 2:
        console.log('Mongoose connection is connecting');
        break;
      case 3:
        console.log('Mongoose connection is disconnecting');
        break;
      default:
        console.log('Mongoose connection state is unknown');
    }
  }
}
