import { Test, TestingModule } from '@nestjs/testing';
import { Client } from 'cassandra-driver';
import { CassandraModule, injectCassandraToken } from '../src';

describe('Cassandra connection', () => {
    let firstCassandra: Client;
    let secondCassandra: Client;
    let module: TestingModule;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [
                CassandraModule.register({
                    contactPoints: ['127.0.0.1'],
                    localDataCenter: 'datacenter1',
                 }),
                CassandraModule.registerAsync({
                    clientName: 'second',
                    useFactory: () => ({
                        contactPoints: ['127.0.0.1:9043'],
                        localDataCenter: 'datacenter1',
                    }),
                }),
            ]
        }).compile();

        module.enableShutdownHooks();
        // FIRST CASSANDRA INSTANCE:
        const firstToken = injectCassandraToken();
        firstCassandra = module.get<Client>(firstToken);
        // SECOND CASSANDRA INSTANCE:
        const secondToken = injectCassandraToken('second');
        secondCassandra = module.get<Client>(secondToken);

        const createKeyspace = "create keyspace IF NOT EXISTS my_keyspace WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1' }";
        const createTable = "create table IF NOT EXISTS students (name varchar primary key)"
        await firstCassandra.execute(createKeyspace);
        await secondCassandra.execute(createKeyspace);

        await firstCassandra.execute('use my_keyspace');
        await secondCassandra.execute('use my_keyspace');
        
        await firstCassandra.execute(createTable);
        await secondCassandra.execute(createTable);

        await firstCassandra.connect();
        await secondCassandra.connect();
    });

    afterAll(async () => {
        const dropTable = 'drop table students';
        const dropKeyspace = 'drop keyspace my_keyspace';

        await firstCassandra.execute(dropTable);
        await secondCassandra.execute(dropTable);
        
        await firstCassandra.execute(dropKeyspace);
        await secondCassandra.execute(dropKeyspace);

        await module.close();
    });

    it('checks if instances are not same', async () => {
        expect(firstCassandra).not.toMatchObject(secondCassandra);
    });

    const PONG = 'PONG';
    it('check if first client connection works', async () => {
        await firstCassandra.execute("INSERT INTO students (name) VALUES ('jano')");
        const result = await firstCassandra.execute('SELECT * FROM students');

        expect(result.rows[0]).toBeDefined();
    });

    it('check if second client connection works', async () => {
        await secondCassandra.execute("INSERT INTO students (name) VALUES ('stefan')");
        const result = await firstCassandra.execute('SELECT * FROM students');

        expect(result.rows[0]).toBeDefined();
    });


    it('check if cassandra connections collision is possible', async () => {
        const query = 'SELECT * FROM students'
        const firstResult = await firstCassandra.execute(query);
        const secondResult = await secondCassandra.execute(query);

        expect(firstResult.rows[0].name).not.toEqual(secondResult.rows[0].name);
    });
});