export { RedisModule } from './redis.module';
// Re-export ioredis under a namespace to avoid version/peer conflicts in consuming apps
export * as ioredis from 'ioredis';
