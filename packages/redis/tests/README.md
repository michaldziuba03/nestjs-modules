## Testing @mich4l/nestjs-redis
You need:
- docker
- Linux OS (if you want to use provided `docker-compose.yml`)

### Tests contains:
- connection with Redis tests
- client name duplication error tests
- connections collision tests

### Make sure `./scripts/create-cluster.sh` script is executable
```bash- docker

chmod +x ./scripts/create-cluster.sh
```

### Run docker-compose
```bash
docker compose up
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
