import { INestApplication } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { TestingModule, Test } from "@nestjs/testing";
import * as request from "supertest";
import { RedisModule } from "../src";
import { RedisTerminusModule } from "../src/health";
import { HealthController } from "./health.controller";

describe('Redis health module', () => {
  let app: INestApplication;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        RedisTerminusModule,
        TerminusModule,
        RedisModule.register({
          name: 'health-test',
          host: 'localhost'
        })
      ],
      controllers: [HealthController],
    })
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should work', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200);
  });
})
