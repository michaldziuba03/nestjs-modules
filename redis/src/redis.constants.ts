export const REDIS_BASE_TOKEN = 'REDIS_CLIENT_';
export const DEFAULT_CONNECTION_NAME = 'default';
export const REDIS_OPTIONS = 'REDIS_OPTIONS';
export const REDIS_TOKEN = 'REDIS_TOKEN';

export enum RedisClientStatus {
    CONNECTING = 'connecting',
    CONNECT = 'connect',
    WAIT = 'wait',
    READY = 'ready',
    END = 'end',
    RECONNECTING = 'reconnecting',
    CLOSE = 'close'
}