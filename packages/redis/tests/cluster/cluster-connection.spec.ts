import { Test, TestingModule } from "@nestjs/testing";
import { Cluster } from "ioredis";
import { RedisClusterModule, injectClusterToken } from "../../src";
import { nodes } from "./nodes";

describe("Redis Cluster connection", () => {
  let module: TestingModule;
  let firstCluster: Cluster;
  let secondCluster: Cluster;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        RedisClusterModule.register({
          nodes,
        }),
        RedisClusterModule.registerAsync({
          clusterToken: "second",
          useFactory: () => ({
            nodes,
          }),
        }),
      ],
    }).compile();

    module.enableShutdownHooks();
    // FIRST REDIS CLUSTER INSTANCE:
    const firstToken = injectClusterToken();
    firstCluster = module.get<Cluster>(firstToken);
    // SECOND REDIS CLUSTER INSTANCE:
    const secondToken = injectClusterToken("second");
    secondCluster = module.get<Cluster>(secondToken);
  });

  it("checks if instances are not same", () => {
    console.log(firstCluster);
    expect(firstCluster).not.toMatchObject(secondCluster);
  });

  it("should create foo key with bar as value", async () => {
    const foo = "foo";
    const bar = "bar";
    console.log("Executing firstCluster.set");
    await firstCluster.set(foo, bar);
    const result = await firstCluster.get(foo);
    console.log("Result of firstCluster.get:", result);

    expect(result).toEqual(bar);
  });

  afterAll(async () => {
    await firstCluster.flushall();
    await module.close();
  });
});
