import { Logger } from "@nestjs/common";
import { ZK_CONTEXT } from "./zookeeper.constants";

export const logger = new Logger(ZK_CONTEXT);