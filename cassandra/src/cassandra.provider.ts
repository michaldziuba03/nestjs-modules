import { Logger, Provider } from "@nestjs/common";
import { Client } from "cassandra-driver";
import { CASSANDRA_CLIENT } from "./cassandra.constants";
import { CassandraModuleAsyncOptions } from "./cassandra.interface";

export function createProvider(client: Client): Provider {
    return {
        provide: CASSANDRA_CLIENT,
        useValue: client,
    }
}

export function createAsyncProvider(moduleOptions: CassandraModuleAsyncOptions): Provider {
    return {
        provide: CASSANDRA_CLIENT,
        inject: moduleOptions.inject,
        useFactory: async (...args: any[]) => {
            const redisOptions = await moduleOptions.useFactory(...args);
            const client = new Client(redisOptions);
            client.connect()
                .then(() => Logger.log('Cassandra connected successfuly', 'CassandraModule')
            )
            
            return client;
        }
    }
}