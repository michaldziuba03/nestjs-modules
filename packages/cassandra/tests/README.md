## Testing @mich4l/nestjs-cassandra
You need:
- docker

### Tests contains:
- connection with Cassandra servers
- client name duplication error tests
- connections collision tests

### Run docker-compose
```bash
docker-compose up
```

### Run migration script
```bash
cd tests
node migrate.js up
```

### Run tests
#### pnpm (recommended for development)
```bash
pnpm test
```

#### Yarn
```bash
yarn test
```

#### npm
```bash
npm run test
```
