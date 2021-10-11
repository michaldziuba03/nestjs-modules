<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

## Nest.js Redis module (in development)
Redis module based on npm library `ioredis`.

### Installation
#### npm
```bash
npm install @mich4l/nestjs-redis
```

#### Yarn
```bash
yarn add @mich4l/nestjs-redis
```

### Example
`app.module.ts`
```ts
@Module({
  imports: [
    RedisModule.register({
      name: 'conn1',
      host: 'localhost',
      port: 6379,
    })
  controllers: [],
  providers: [],
})
export class AppModule {}
```

`example.service.ts`
```ts
import { Inject, Injectable } from '@nestjs/common';
import { InjectCassandra } from '@mich4l/nestjs-redis';
import { Redis } from 'ioredis';

@Injectable()
export class ExampleService {
    constructor(
        @InjectRedis('conn1')
        private readonly redis: Redis,
    ) {}

    async getAllPosts() {
        const key = 'posts';
        const result = await this.redis.get(key);

        return JSON.parse(result);
    }
}
```