import { Logger } from "@nestjs/common";
import { Client } from "cassandra-driver";
import {
  CASSANDRA_CLIENT,
  CASSANDRA_CONTEXT,
  CASSANDRA_DEFAULT_TOKEN,
} from "./cassandra.constants";
import { CassandraModuleOptions } from "./cassandra.interface";

export const logger = new Logger(CASSANDRA_CONTEXT);

const tokens: string[] = [];
export function validateCassandraToken(
  token: string = CASSANDRA_DEFAULT_TOKEN
) {
  if (tokens.includes(token)) {
    throw new Error(`Duplication error for clientName: ${token}`);
  }

  tokens.push(token);
  return token;
}

export async function createClient(options: CassandraModuleOptions) {
  const client = new Client(options);
  logger.log("Cassandra client instance is ready");
  if (!options.noConnect) {
    await client.connect();
  }

  if (options.onReady) {
    await options.onReady(client);
  }

  return client;
}

export async function shutdownClient(client: Client) {
  await client.shutdown();
}

export function createCassandraToken(token: string = CASSANDRA_DEFAULT_TOKEN) {
  return `${CASSANDRA_CLIENT}${token}`;
}
