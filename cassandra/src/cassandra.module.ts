import { DynamicModule, Global, Logger, Module, OnApplicationShutdown } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { DseClientOptions, Client } from 'cassandra-driver';
import { CASSANDRA_CLIENT } from "src";
import { CassandraModuleAsyncOptions } from "./cassandra.interface";
import { createAsyncProvider, createProvider } from "./cassandra.provider";

@Global()
@Module({})
export class CassandraModule implements OnApplicationShutdown {
    constructor(
        private readonly moduleRef: ModuleRef,
    ) {}

    static register(options: DseClientOptions): DynamicModule {
        const client = new Client(options);
        client
            .connect()
            .then(() => {
                Logger.log('Cassandra connected successfuly', 'CassandraModule');
            });
        
        const providers = [createProvider(client)];

        return {
            module: CassandraModule,
            providers,
            exports: providers,
        }
    }

    static registerAsync(options: CassandraModuleAsyncOptions): DynamicModule {
        const providers = [createAsyncProvider(options)];

        return {
            module: CassandraModule,
            imports: options.imports,
            providers,
            exports: providers,
        }
    }

    async onApplicationShutdown() {
        const client = this.moduleRef.get<Client>(CASSANDRA_CLIENT);
        if (client) {
            await client.shutdown();
        }
    }
}
