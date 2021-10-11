export const REDIS_CLIENTS = 'REDIS_CLIENTS';
export const REDIS_PROVIDER = 'REDIS_PROVIDER';
export const REDIS_CLIENT_BASE = 'REDIS_CLIENT_';
export const REDIS_LOGGER_CONTEXT = 'RedisModule';
export const REDIS_OPTIONS = 'REDIS_OPTIONS';

export enum RedisClientStatus {
    CONNECTING = 'connecting',
    CONNECT = 'connect',
    WAIT = 'wait',
    READY = 'ready',
    END = 'end',
    RECONNECTING = 'reconnecting',
    CLOSE = 'close'
}