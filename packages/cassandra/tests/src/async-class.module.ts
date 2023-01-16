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
import { Module } from '@nestjs/common';
import { StudentModule } from './student/student.module';

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
  imports: [
    CassandraModule.forRootAsync({
      useClass: ConfigService,
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
export class AsyncClassModule {}
