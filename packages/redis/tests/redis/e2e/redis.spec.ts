import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { Server } from 'http';
import * as request from 'supertest';

describe('Test standard configuration', () => {
  let app: INestApplication;
  let server: Server;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    server = app.getHttpServer();

    await app.init();
  });

  it('should return success with value true', async () => {
    return request(server)
      .get('/pong')
      .expect(200)
      .expect({ success: true, pong: 'PONG' });
  });

  afterAll(async () => {
    await app.close();
  });
});
