import { Inject } from "@nestjs/common"
import { REDIS_CLIENT_BASE, REDIS_CLIENTS } from "./redis.constants"

export const getToken = (clientName: string) => `${REDIS_CLIENT_BASE}${clientName}`;

export const InjectRedis = (clientName: string = 'default') => {
    const token = getToken(clientName);
    return Inject(token);
}

export const InjectRedisClients = () => Inject(REDIS_CLIENTS);