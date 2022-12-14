import { Global, Module, OnApplicationShutdown } from "@nestjs/common";

@Global()
@Module({})
export class ZookeeperModule implements OnApplicationShutdown {
    constructor() {}

    onApplicationShutdown(signal?: string) {
        console.log(signal);        
    }
}