import { Inject } from '@nestjs/common';
import { CASSANDRA_CLIENT } from './cassandra.constants';

export const InjectCassandra = () => {
    return Inject(CASSANDRA_CLIENT);
}
