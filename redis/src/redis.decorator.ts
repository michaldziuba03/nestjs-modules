import { Inject } from "@nestjs/common"
import { DEFAULT_CONNECTION_NAME } from "./redis.constants";
import { getConnectionToken } from "./redis.utils"

export const InjectRedis = (connectionName: string = DEFAULT_CONNECTION_NAME) => {
    const token = getConnectionToken(connectionName);
    
    return Inject(token);
}

export const injectRedisToken = (connectionName: string = DEFAULT_CONNECTION_NAME) => getConnectionToken(connectionName);
