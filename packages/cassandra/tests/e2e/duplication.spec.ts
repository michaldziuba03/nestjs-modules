import { CassandraModule } from '../../lib';
import {
  contactPoints1,
  contactPoints2,
  localDataCenter,
} from '../src/options';

const duplicated = 'duplicated';

const createModules = () => {
  return {
    imports: [
      CassandraModule.forRoot({
        clientName: duplicated,
        contactPoints: contactPoints1,
        localDataCenter,
      }),
      CassandraModule.forRootAsync({
        clientName: duplicated,
        useFactory: () => ({
          contactPoints: contactPoints2,
          localDataCenter,
        }),
      }),
    ],
  };
};

describe('Cassandra connections duplication', () => {
  it('should throw duplication error', async () => {
    expect(createModules).toThrow();
  });
});
