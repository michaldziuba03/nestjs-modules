import { Inject } from '@nestjs/common';
import { CASSANDRA_CLIENT, CASSANDRA_DEFAULT_TOKEN } from './cassandra.constants';
import { createCassandraToken } from './cassandra.utils';

export const InjectCassandra = (clientName: string = CASSANDRA_DEFAULT_TOKEN) => {
    const token = createCassandraToken(clientName);
    return Inject(token);
}

export const injectCassandraToken = (clientName: string = CASSANDRA_DEFAULT_TOKEN) => createCassandraToken(clientName);
