import { DynamicModule, Global, Logger, Module } from "@nestjs/common";
import { DseClientOptions, Client } from 'cassandra-driver';
import { CassandraModuleAsyncOptions } from "./cassandra.interface";
import { createAsyncProvider, createProvider } from "./cassandra.provider";

@Global()
@Module({})
export class CassandraModule {
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
}