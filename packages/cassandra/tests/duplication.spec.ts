import { CassandraModule } from "../src";

const duplicated = "duplicated";

const createModules = () => {
  return {
    imports: [
      CassandraModule.forRoot({
        clientName: duplicated,
        contactPoints: ["127.0.0.1"],
        localDataCenter: "datacenter1",
      }),
      CassandraModule.forRootAsync({
        clientName: duplicated,
        useFactory: () => ({
          contactPoints: ["127.0.0.1"],
          localDataCenter: "datacenter1",
        }),
      }),
    ],
  };
};

describe("Cassandra connections duplication", () => {
  it("should throw duplication error", async () => {
    expect(createModules).toThrow();
  });
});
