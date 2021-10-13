import { Redis, Cluster } from "ioredis";

export enum RedisStatus {
    CONNECTING = 'connecting',
    CONNECT = 'connect',
    WAIT = 'wait',
    READY = 'ready',
    END = 'end',
    RECONNECTING = 'reconnecting',
    CLOSE = 'close'
}

export async function shutdownClient(client: Redis | Cluster) {
    if (client.status === RedisStatus.READY) {
        await client.quit();
    }

    client.disconnect();
}