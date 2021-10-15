## Testing @mich4l/nestjs-cassandra
You need:
- docker
- docker-compose

### Tests contains:
- connection with Cassandra servers
- client name duplication error tests
- connections collistion tests

### Run docker-compose in `/tests` directory
```bash
$ cd tests
$ docker-compose up
```

### Run migration script
```bash
$ node migrate.js up
```

### Run tests
#### Yarn
```bash
$ yarn test
```

#### npm
```bash
$ npm run test
```
