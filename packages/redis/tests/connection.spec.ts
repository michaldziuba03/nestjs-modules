import { Test, TestingModule } from "@nestjs/testing";
import { Redis } from "ioredis";
import { RedisModule, injectRedisToken } from "../src";

describe("Redis connection", () => {
  let firstRedis: Redis;
  let secondRedis: Redis;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        RedisModule.forRoot({
          host: "localhost",
          port: 2137,
        }),
        RedisModule.forRootAsync({
          name: "second",
          useFactory: () => ({
            host: "localhost",
            port: 2138,
          }),
        }),
      ],
    }).compile();

    module.enableShutdownHooks();
    // FIRST REDIS INSTANCE:
    const firstToken = injectRedisToken();
    firstRedis = module.get<Redis>(firstToken);
    // SECOND REDIS INSTANCE:
    const secondToken = injectRedisToken("second");
    secondRedis = module.get<Redis>(secondToken);
  });

  afterAll(async () => {
    await firstRedis.flushall();
    await secondRedis.flushall();
    await module.close();
  });

  it("checks if instances are not same", async () => {
    expect(firstRedis).not.toMatchObject(secondRedis);
  });

  const PONG = "PONG";
  it("check if first client connection works", async () => {
    const result = await firstRedis.ping();
    expect(result).toEqual(PONG);
  });

  it("check if second client connection works", async () => {
    const result = await secondRedis.ping();
    expect(result).toEqual(PONG);
  });

  const key = "HELLO";
  const value = "WORLD";

  it("should successfully create HELLO key", async () => {
    await firstRedis.set(key, value);

    const testResult = await firstRedis.get(key);
    expect(testResult).toEqual(value);
  });

  it("check if redis connections collision is possible", async () => {
    // firstRedis and secondRedis are SEPERATED Redis databases
    // And for that reason we are testing if RedisModule provides correct Redis instance.
    const result = await secondRedis.get(key);
    expect(result).toBeFalsy();

    const originalResult = await firstRedis.get(key);
    expect(originalResult).not.toEqual(result);
  });
});
