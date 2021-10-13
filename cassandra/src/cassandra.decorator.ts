import { Inject } from '@nestjs/common';
import { CASSANDRA_CLIENT, CASSANDRA_DEFAULT_TOKEN } from './cassandra.constants';
import { createCassandraToken } from './cassandra.utils';

export const InjectCassandra = () => {
    return Inject(CASSANDRA_CLIENT);
}

export const injectCassandraToken = (token: string = CASSANDRA_DEFAULT_TOKEN) => createCassandraToken(token);
