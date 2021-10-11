<p align="center">
  <img src="https://user-images.githubusercontent.com/43048524/136818805-b9fc463e-3829-4dab-b943-f5e18425c6ff.png" width="320" alt="Nest Cassandra Logo" />
</p>

## Nest.js Cassandra module
Cassandra module based on npm library `cassandra-driver`.

### Installation
#### npm
```bash
npm install @mich4l/nestjs-cassandra
```

#### Yarn
```bash
yarn add @mich4l/nestjs-cassandra
```

### Examples
`app.module.ts`
```ts
import { Module } from '@nestjs/common';
import { CassandraModule } from 'mich4l/nestjs-cassandra';

@Module({
  imports: [
    CassandraModule.register({
      keyspace: 'my_keyspace',
      contactPoints: ['127.0.0.1'],
      localDataCenter: 'datacenter1',
    }),
  controllers: [],
  providers: [],
})
export class AppModule {}
```

`example.service.ts`
```ts
import { Inject, Injectable } from '@nestjs/common';
import { InjectCassandra } from '@mich4l/nestjs-cassandra';
import { Client } from 'cassandra-driver';

@Injectable()
export class ExampleService {
    constructor(
        @InjectCassandra()
        private readonly dbClient: Client,
    ) {}

    async getAllPosts() {
        const query = 'SELECT * FROM posts';
        const result = await this.dbClient.execute(query);

        return result.rows[0];
    }
}
```

### Async register example
```ts
@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
    }),
    CassandraModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          keyspace: config.get('CASSANDRA_KEYSPACE'),
          localDataCenter: config.get('CASSANDRA_DATACENTER'),
          contactPoints: ['127.0.0.1'],
        }
      }
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

### Graceful shutdown
Module closes connection using `onApplicationShutdown` hook. You may need:

`main.ts`
```ts
...
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
  });

  app.enableShutdownHooks();
  await app.listen(3000);
}
bootstrap();
```
