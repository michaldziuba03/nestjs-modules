import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AsyncExistingModule } from '../src/async-existing.module';
import { Server } from 'http';
import * as request from 'supertest';

describe('Test async cluster configuration with useExisting option', () => {
  let app: INestApplication;
  let server: Server;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AsyncExistingModule],
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
