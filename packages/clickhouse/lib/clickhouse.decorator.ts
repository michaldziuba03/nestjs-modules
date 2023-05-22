import { Inject } from '@nestjs/common';
import { getConnectionToken } from './clickhouse.utils';

export const InjectClickHouse = (connectionName?: string) => {
  const token = getConnectionToken(connectionName);
  return Inject(token);
};

export const injectClickHouse = (connectionName?: string) =>
  getConnectionToken(connectionName);
