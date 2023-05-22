import { INestApplication } from '@nestjs/common';
import { Server } from 'http';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AsyncExistingModule } from '../src/async-existing.module';

describe('Test async useExisting configuration', () => {
  let app: INestApplication;
  let server: Server;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AsyncExistingModule],
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
