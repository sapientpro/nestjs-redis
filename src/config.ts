/**
 * Configuration factory for Redis (namespace: "redis").
 *
 * Reads standard environment variables and maps them to ioredis options.
 * - REDIS_HOST (default: localhost)
 * - REDIS_PORT (default: 6379)
 * - REDIS_DB   (default: 0)
 * - REDIS_PASSWORD (optional)
 * - REDIS_TLS ("1", "on", "true" => enabled)
 * - REDIS_PREFIX (optional) ioredis keyPrefix, e.g. "staging:", for servers with database 0 only
 */
import { registerAs } from '@nestjs/config';
import type { RedisOptions } from 'ioredis';

export default registerAs(
  'redis',
  () =>
    ({
      host: process.env['REDIS_HOST'] || 'localhost',
      port: +(process.env['REDIS_PORT'] || 6379),
      db: +(process.env['REDIS_DB'] || 0),
      password: process.env['REDIS_PASSWORD'],
      tls: ['1', 'on', 'true'].includes(process.env['REDIS_TLS'] || '') ? {} : undefined,
      keyPrefix: process.env['REDIS_PREFIX'] || undefined,
      // Let ioredis handle retries globally; set null to bubble up errors in pipelines/blocks as needed
      maxRetriesPerRequest: null,
    }) as RedisOptions,
);
