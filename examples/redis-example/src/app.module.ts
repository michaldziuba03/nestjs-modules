import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from '@mich4l/nestjs-redis';

@Module({
  imports: [
    RedisModule.forRoot({
      name: 'conn1',
      connectUrl: 'redis://localhost:6379',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
