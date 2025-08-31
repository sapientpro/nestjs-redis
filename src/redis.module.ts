import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis, { RedisOptions } from 'ioredis';
import config from './config';

@Global()
@Module({
  imports: [ConfigModule.forFeature(config)],
  providers: [
    {
      provide: Redis,
      inject: [ConfigService],
      async useFactory(configService: ConfigService) {
        const redisConfig = configService.getOrThrow<RedisOptions>('redis');
        const client = new Redis(redisConfig);

        // Ensure the client is connected before injection
        await new Promise<void>((resolve, reject) => {
          client.once('connect', () => resolve());
          client.once('error', (err) => reject(err));
        });

        return client;
      },
    },
  ],
  exports: [Redis, ConfigModule],
})
export class RedisModule {}
