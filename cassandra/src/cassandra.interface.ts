import { ModuleMetadata } from '@nestjs/common';
import { DseClientOptions } from 'cassandra-driver';

export interface CassandraModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    useFactory: (...args: any) => DseClientOptions;
    inject?: any[];
}