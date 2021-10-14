## Testing @mich4l/nestjs-redis
You need:
- docker
- docker-compose

### Tests contains:
- connection with Redis tests
- client name duplication error tests
- connections collistion tests

### Run docker-compose in `/tests` directory
```bash
$ cd tests
$ docker-compose up
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
