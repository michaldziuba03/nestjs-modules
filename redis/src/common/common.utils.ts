import { Redis, Cluster } from "ioredis";

export async function shutdownClient(client: Redis | Cluster) {
    if (client.status === 'ready') {
        await client.quit();
    }

    client.disconnect();
}