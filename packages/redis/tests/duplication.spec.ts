import { RedisModule } from "../src";

const createModules = () => {
  return {
    imports: [
      RedisModule.forRoot({
        name: "duplicated",
        host: "localhost",
        port: 2137,
      }),
      RedisModule.forRootAsync({
        name: "duplicated",
        useFactory: () => ({
          host: "localhost",
          port: 2138,
        }),
      }),
    ],
  };
};

describe("Redis connections duplication", () => {
  it("should throw duplication error", async () => {
    expect(createModules).toThrow();
  });
});
