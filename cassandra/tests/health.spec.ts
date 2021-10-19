import { TerminusModule } from "@nestjs/terminus";
import { Test, TestingModule } from "@nestjs/testing";
import { CassandraTerminusModule } from "../src/health";
import { CassandraModule } from "../src";
import { HealthController } from "./health.controller";
import * as request from 'supertest';
import { INestApplication } from "@nestjs/common";

describe('Health check integration', () => {
  let app: INestApplication;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        CassandraTerminusModule,
        TerminusModule,
        CassandraModule.register({
          clientName: "health",
          contactPoints: ['127.0.0.1'],
          localDataCenter: 'datacenter1',
        })
      ],
      controllers: [HealthController],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should work', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
  });

  it('should return correct structure', async () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .then(res => {
        expect(res.body.status).toEqual('ok');
      })
  });
});

