import { DynamicModule, Global, Logger, Module, Provider } from "@nestjs/common";
import { DseClientOptions, Client } from 'cassandra-driver';
import { CASSANDRA_CLIENT } from "./cassandra.constants";
import { CassandraModuleAsyncOptions } from "./cassandra.interface";

function createProvider(client: Client): Provider {
    return {
        provide: CASSANDRA_CLIENT,
        useValue: client,
    }
}

function createAsyncProvider(moduleOptions: CassandraModuleAsyncOptions): Provider {
    return {
        provide: CASSANDRA_CLIENT,
        inject: moduleOptions.inject,
        useFactory: async (...args: any[]) => {
            const redisOptions = await moduleOptions.useFactory(...args);
            const client = new Client(redisOptions);
            await client.connect()
            Logger.log('Cassandra connected successfuly', 'CassandraModule');
            
            return client;
        }
    }
}

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
        }
    }
}