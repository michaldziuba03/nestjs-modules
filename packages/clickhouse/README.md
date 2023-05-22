<p align="center">
  <img src="https://github.com/michaldziuba03/nestjs-modules/assets/43048524/3681cb86-1e28-465a-8379-c8ae8161998b" width="320" alt="Nest Cassandra Logo" />
</p>

## ClickHouse module for Nest.js
ClickHouse module based on official client `@clickhouse/client`.

### Installation
```shell
# pnpm:
pnpm add @md03/nestjs-clickhouse @clickhouse/client
# npm:
npm install @md03/nestjs-clickhouse @clickhouse/client
```

### Basic usage
By default module is registered as global (you can change this behavior with `isGlobal` parameter).
> app.module.ts
```ts
import { Module } from '@nestjs/common';
import { ClickHouseModule } from '@md03/nestjs-clickhouse';


@Module({
  imports: [
    ClickHouseModule.forRoot({
      host: 'http://localhost:8123',
      username: 'default',
      password: '',
    }),
    ClickHouseModule.forRootAsync({
      name: 'conn2'
      useFactory: () => ({
        host: 'http://localhost:8124',
        username: 'default',
        password: 'pass123',
      }),
    }),
  ],
})
export class AppModule {}
```

> example.service.ts
```ts
import { Injectable } from '@nestjs/common';
import { InjectClickHouse } from '@md03/nestjs-clickhouse';
import type { ClickHouseClient } from '@clickhouse/client';

@Injectable()
export class ExampleService {
  constructor(
    @InjectClickHouse()
    private readonly client: ClickHouseClient,
  ) {}

  async getStats() {
    const result = await this.client.query(...);
  }
}

```

### Common problems
#### ReferenceError: ClickHouseClient is not defined
1. Make sure you have `@clickhouse/client` installed along side `@md03/nestjs-clickhouse` (this module requires client as peer dependency)
2. Import as type instead class
```ts
import type { ClickHouseClient } from '@clickhouse/client';
```
