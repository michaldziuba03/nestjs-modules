import { Module } from '@nestjs/common';
import { CassandraModule } from '../../lib';
import {
  clientName,
  contactPoints1,
  contactPoints2,
  keyspace,
  localDataCenter,
  noConnect,
} from './options';
import { StudentModule } from './student/student.module';

@Module({
  imports: [
    CassandraModule.forRootAsync({
      useFactory: () => ({
        contactPoints: contactPoints1,
        localDataCenter,
        keyspace,
        noConnect,
      }),
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
export class AsyncFactoryModule {}
