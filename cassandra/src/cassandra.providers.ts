import { Provider } from "@nestjs/common";
import { CASSANDRA_DEFAULT_TOKEN, CASSANDRA_OPTIONS, CASSANDRA_TOKEN } from "./cassandra.constants";
import { CassandraModuleAsyncOptions, CassandraModuleOptions } from "./cassandra.interface";
import { createCassandraToken, createClient } from "./cassandra.utils";

export function createTokenProvider(token: string = CASSANDRA_DEFAULT_TOKEN): Provider {
    return {
        provide: CASSANDRA_TOKEN,
        useValue: token,
    }
}

export function createClientProvider(token?: string): Provider {
    return {
        provide: createCassandraToken(token || CASSANDRA_DEFAULT_TOKEN),
        inject: [CASSANDRA_OPTIONS],
        useFactory: createClient,
    }
}

export function createCassandraOptions(options: CassandraModuleOptions): Provider {
    return {
        provide: CASSANDRA_OPTIONS,
        useValue: options,
    }
}

export function createCassandraAsyncOptions(options: CassandraModuleAsyncOptions): Provider {
    return {
        provide: CASSANDRA_OPTIONS,
        inject: options.inject,
        useFactory: options.useFactory,
    }
}