import { INestApplication } from '@nestjs/common';
import { Server } from 'http';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AsyncFactoryModule } from '../src/async-factory.module';

describe('Test async useFactory configuration', () => {
  let app: INestApplication;
  let server: Server;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AsyncFactoryModule],
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
