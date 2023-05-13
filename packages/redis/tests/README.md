## Testing @mich4l/nestjs-redis
You need:
- docker

### Tests contains:
- connection with Redis tests
- client name duplication error tests
- connections collision tests

### Run docker-compose
```bash
docker compose up
```
> If you encounter problems with `md03/redis-cluster` image - create issue in my [docker-images](https://github.com/michaldziuba03/docker-images) repository. I made this image to make development easier on other platforms than Linux.

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