# @sapientpro/nestjs-redis
[![NPM Package](https://img.shields.io/npm/v/@sapientpro/nestjs-redis.svg)](https://www.npmjs.org/package/@sapientpro/nestjs-redis)

Lightweight Redis module for NestJS built on top of ioredis. It integrates with @nestjs/config, provides a connected Redis client for injection, and supports TLS via simple environment variables.

## Installation

```sh
npm install @sapientpro/nestjs-redis ioredis
```

## Quick start

1) Import RedisModule and inject Redis (ioredis client)

```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '@sapientpro/nestjs-redis';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RedisModule,
  ],
})
export class AppModule {}
```

```ts
// some.service.ts
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class SomeService {
  constructor(private readonly redis: Redis) {}

  async setValue(key: string, value: string) {
    await this.redis.set(key, value);
  }

  async getValue(key: string) {
    return this.redis.get(key);
  }
}
```

2) Configure via environment variables (loaded by @nestjs/config)

The module registers a configuration namespace `redis` built from these env variables:
- REDIS_HOST (default: localhost)
- REDIS_PORT (default: 6379)
- REDIS_DB (default: 0)
- REDIS_PASSWORD (optional)
- REDIS_TLS ("1", "on", or "true" to enable TLS)
- REDIS_PREFIX (optional): ioredis `keyPrefix`, e.g. `staging:`. Lets several apps or environments share
  one server that has database 0 only, such as Azure Managed Redis. BullMQ rejects a client with
  `keyPrefix`: pass the options to BullMQ without it and set BullMQ's own `prefix` instead.

Example .env:

```
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0
# REDIS_PASSWORD=your_password
# REDIS_TLS=true
# REDIS_PREFIX=staging:
```

3) Using the ioredis namespace re-export (optional)

If you need ioredis types or utilities directly but want to avoid version conflicts, you can import from this package:

```ts
import { ioredis } from '@sapientpro/nestjs-redis';

const KeyPrefix: ioredis.KeyPrefix = { prefix: 'app:' };
```

## API Summary

- RedisModule: Nest module that provides a connected ioredis client.
- Inject token: use the Redis class from ioredis as the provider token.
- Config: provided via @nestjs/config under the `redis` namespace (see src/config.ts in the package).

## Notes

- The module waits for the initial connection before making the client available via DI. If connection fails at startup, the module provider factory will reject and surface the error.
- `maxRetriesPerRequest` is set to `null` by default to allow commands in certain states (like blocking commands) without forced retries. Adjust to your needs if you rely on different retry semantics.

## License

MIT © SapientPro