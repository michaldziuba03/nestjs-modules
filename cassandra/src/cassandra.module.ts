import { DynamicModule, Global, Inject, Module, OnApplicationShutdown } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { Client } from "cassandra-driver";
import { CASSANDRA_OPTIONS, CASSANDRA_TOKEN } from "./cassandra.constants";
import { CassandraModuleAsyncOptions, CassandraModuleOptions, CassandraOptions } from "./cassandra.interface";
import { createCassandraAsyncOptions, createCassandraOptions, createClientProvider, createTokenProvider } from "./cassandra.providers";
import { createCassandraToken, logger, shutdownClient, validateCassandraToken } from "./cassandra.utils";

@Global()
@Module({})
export class CassandraModule implements OnApplicationShutdown {
    constructor(
        @Inject(CASSANDRA_OPTIONS)
        private readonly clientOptions: CassandraOptions,
        @Inject(CASSANDRA_TOKEN)
        private readonly clientToken: string,
        private readonly moduleRef: ModuleRef,
    ) {}

    static register(options: CassandraModuleOptions): DynamicModule {
        const token = validateCassandraToken(options.clientName);
        const tokenProvider = createTokenProvider(token);
        const optionsProvider = createCassandraOptions(options);
        const clientProvider = createClientProvider(token);

        return {
            module: CassandraModule,
            providers: [tokenProvider, optionsProvider, clientProvider],
            exports: [clientProvider],
        }
    }

    static registerAsync(options: CassandraModuleAsyncOptions): DynamicModule {
        const token = validateCassandraToken(options.clientName);
        const tokenProvider = createTokenProvider(token);
        const optionsProvider = createCassandraAsyncOptions(options);
        const clientProvider = createClientProvider(token);

        return {
            module: CassandraModule,
            imports: options.imports,
            providers: [tokenProvider, optionsProvider, clientProvider],
            exports: [clientProvider],
        }
    }

    async onApplicationShutdown() {
        const token = createCassandraToken(this.clientToken);
        const client = this.moduleRef.get<Client>(token);
        if (client) {
            if (this.clientOptions.beforeShutdown) {
                await this.clientOptions.beforeShutdown(client);
            }
            
            logger.log(`Closing Cassandra connection: ${this.clientToken}`);
            await shutdownClient(client);
        }
    }
}
