import {
  CLICKHOUSE_BASE_TOKEN,
  DEFAULT_CONNECTION_NAME,
} from './clickhouse.constants';

const tokens: string[] = [];

export function validateConnectionName(name: string) {
  if (tokens.includes(name)) {
    throw new Error(`ClickHouse connection name duplication for: ${name}`);
  }

  tokens.push(name);
  return name;
}

export function getConnectionToken(name: string = DEFAULT_CONNECTION_NAME) {
  return `${CLICKHOUSE_BASE_TOKEN}${name}`;
}
