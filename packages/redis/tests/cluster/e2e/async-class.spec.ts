import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AsyncClassModule } from '../src/async-class.module';
import { Server } from 'http';
import * as request from 'supertest';

describe('Test async cluster configuration with useClass option', () => {
  let app: INestApplication;
  let server: Server;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AsyncClassModule],
    }).compile();

    app = module.createNestApplication();
    server = app.getHttpServer();

    await app.init();
  });

  it('should return PONG', () => {
    return request(server).get('/pong').expect(200).expect({ pong: 'PONG' });
  });

  afterAll(async () => {
    await app.close();
  });
});
