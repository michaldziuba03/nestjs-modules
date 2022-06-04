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

### You must also create Redis cluster with nodes:
 - 127.0.0.1:7000
 - 127.0.0.1:7001
 - 127.0.0.1:7002
 - 127.0.0.1:7003
 - 127.0.0.1:7004
 - 127.0.0.1:7005
 - 127.0.0.1:7006
 - 127.0.0.1:7007

Good resource for creating basic Redis cluster from YouTube: https://www.youtube.com/watch?v=N8BkmdZzxDg

TO-DO: setup cluster in docker-compose

### Run tests
#### Yarn
```bash
$ yarn test
```

#### npm
```bash
$ npm run test
```
