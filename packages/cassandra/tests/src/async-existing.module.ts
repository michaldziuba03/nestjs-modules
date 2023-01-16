import {
  CassandraModule,
  CassandraOptions,
  CassandraOptionsFactory,
} from '../../lib';
import {
  clientName,
  contactPoints1,
  contactPoints2,
  keyspace,
  localDataCenter,
  noConnect,
} from './options';
import { Injectable, Module } from '@nestjs/common';
import { StudentModule } from './student/student.module';

@Injectable()
class ConfigService implements CassandraOptionsFactory {
  createCassandraOptions(): CassandraOptions {
    return {
      contactPoints: contactPoints1,
      localDataCenter,
      keyspace,
      noConnect,
    };
  }
}

@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
class ConfigModule {}

@Module({
  imports: [
    CassandraModule.forRootAsync({
      imports: [ConfigModule],
      useExisting: ConfigService,
    }),
    CassandraModule.forRoot({
      clientName,
      contactPoints: contactPoints2,
      localDataCenter,
      keyspace,
      noConnect,
    }),
    StudentModule,
  ],
})
export class AsyncExistingModule {}
