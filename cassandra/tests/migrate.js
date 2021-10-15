var scriptArgs = process.argv.slice(2);
const { Client } = require('cassandra-driver');

const firstCassandra = new Client({
    contactPoints: ['127.0.0.1'],
    localDataCenter: 'datacenter1',
});

const secondCassandra = new Client({
    contactPoints: ['127.0.0.1:9043'],
    localDataCenter: 'datacenter1',
});

async function closeConnections() {
    console.log('Closing connections...');
    await firstCassandra.shutdown();
    await secondCassandra.shutdown();
}

async function executeBoth(query) {
    await firstCassandra.execute(query);
    await secondCassandra.execute(query);
}

async function up() {
    const createKeyspace = "CREATE KEYSPACE IF NOT EXISTS my_keyspace WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1' }";
    const useKeyspace = 'USE my_keyspace';
    const createTable = "CREATE TABLE IF NOT EXISTS students (name varchar primary key)";

    await executeBoth(createKeyspace);
    await executeBoth(useKeyspace);
    await executeBoth(createTable);

    console.log('Keyspaces and Tables created');
}

async function down() {
    const useKeyspace = 'USE my_keyspace';
    const dropTable = 'DROP TABLE students';
    const dropKeyspace = 'DROP KEYSPACE my_keyspace';

    await executeBoth(useKeyspace);
    await executeBoth(dropTable);
    await executeBoth(dropKeyspace);

    console.log('Keyspaces and Tables dropped');
}

const upCommands = ['up', 'UP', 'uP', 'Up'];
const downCommands = ['down', 'DOWN', 'Down', 'dOWN', 'dowN'];

async function run() {
    const command = scriptArgs[0];

    if (upCommands.includes(command)) {
        await up();
        await closeConnections();
        return;
    }

    if (downCommands.includes(command)) {
        await down();
        await closeConnections();
        return;
    }

    console.log('You must provide additional argument');
    console.log('"up" or "down"', '\n\nExample: node migrate.js up');
}

run();