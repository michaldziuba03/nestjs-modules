import {
  CLICKHOUSE_BASE_TOKEN,
  DEFAULT_CONNECTION_NAME,
  CLICKHOUSE_CONTEXT,
} from './clickhouse.constants';
import { Logger } from '@nestjs/common';

export const logger = new Logger(CLICKHOUSE_CONTEXT);

const tokens: string[] = [];

export function validateConnectionName(name: string = DEFAULT_CONNECTION_NAME) {
  if (tokens.includes(name)) {
    throw new Error(`ClickHouse connection name duplication for: ${name}`);
  }

  tokens.push(name);
  return name;
}

export function getConnectionToken(name: string = DEFAULT_CONNECTION_NAME) {
  return `${CLICKHOUSE_BASE_TOKEN}${name}`;
}
