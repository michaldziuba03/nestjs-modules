import { INestApplication } from '@nestjs/common';
import { Server } from 'http';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AsyncClassModule } from '../src/async-class.module';

describe('Test async useClass configuration', () => {
  let app: INestApplication;
  let server: Server;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AsyncClassModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.enableShutdownHooks();
    server = app.getHttpServer();

    await app.init();
  });

  it('should get ping successfully', () => {
    return request(server).get('/ping').expect(200).expect({ success: true });
  });

  afterAll(async () => {
    await app.close();
  });
});
