import { Test, TestingModule } from "@nestjs/testing";
import { injectRedisToken, RedisModule } from "../src";
import Redis from "ioredis";

describe("Test graceful shutdown", () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        RedisModule.forRoot({
          host: "localhost",
          port: 2137,
        }),
      ],
    }).compile();

    module.enableShutdownHooks();
  });

  it("Should gracefully disconnect Redis instance", async () => {
    const client = module.get<Redis>(injectRedisToken());
    const disconnectSpy = jest.spyOn(client, "disconnect");
    await module.close();

    expect(disconnectSpy).toBeCalled();
  });
});
