import { injectRedisToken } from "../src";

describe("Injection token", () => {
  it("should return default token", () => {
    const token = injectRedisToken();
    expect(token).toContain("default");
  });

  it("should return conn1 token", () => {
    const clientName = "conn1";
    const token = injectRedisToken(clientName);
    expect(token).toContain(clientName);
  });
});
