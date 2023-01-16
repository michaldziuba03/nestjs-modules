import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AsyncFactoryModule } from '../src/async-factory.module';
import { Server } from 'http';
import * as request from 'supertest';

describe('Test async cluster configuration with useFactory option', () => {
  let app: INestApplication;
  let server: Server;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AsyncFactoryModule],
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
