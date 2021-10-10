import { Module, Global, OnApplicationShutdown, DynamicModule } from '@nestjs/common';
import Redis from 'ioredis';

type ModuleOptions = Redis.RedisOptions | Redis.RedisOptions[];

@Global()
@Module({})
export class RedisModule implements OnApplicationShutdown {
    static register(options: ModuleOptions): DynamicModule {

        return {
            module: RedisModule,
        }
    }
    
    onApplicationShutdown() {

    }
}
