import { Inject } from "@nestjs/common";
import { createCassandraToken } from "./cassandra.utils";

export const InjectCassandra = (clientName?: string) => {
  const token = createCassandraToken(clientName);
  return Inject(token);
};

export const injectCassandraToken = (clientName?: string) =>
  createCassandraToken(clientName);
