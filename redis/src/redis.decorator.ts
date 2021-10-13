import { Inject } from "@nestjs/common"
import { getConnectionToken } from "./redis.utils"

export const InjectRedis = (connectionName?: string) => {
    const token = getConnectionToken(connectionName);
    return Inject(token);
}

export const injectRedisToken = (connectionName?: string) => getConnectionToken(connectionName);
