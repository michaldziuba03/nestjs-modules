## Testing @mich4l/nestjs-redis
You need:
- docker
- docker-compose

### Tests contains:
- connection with Redis tests
- client name duplication error tests
- connections collision tests

### Run docker-compose
```bash
$ docker compose up
```

### Run tests

#### pnpm (recommended for development)
```bash
$ pnpm test
```

#### Yarn
```bash
$ yarn test
```

#### npm
```bash
$ npm run test
```
