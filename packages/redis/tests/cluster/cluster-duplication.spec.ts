import { RedisClusterModule } from "../../src";
import { nodes } from "./nodes";

const clusterToken = "duplicated";

const createModules = () => {
  return {
    imports: [
      RedisClusterModule.forRoot({
        clusterToken,
        nodes,
      }),
      RedisClusterModule.forRootAsync({
        clusterToken,
        useFactory: () => ({
          nodes,
        }),
      }),
    ],
  };
};

describe("Redis cluster connections duplication", () => {
  it("should throw duplication error", async () => {
    expect(createModules).toThrow();
  });
});
