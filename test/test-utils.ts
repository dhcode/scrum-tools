import { ConfigModule } from '@nestjs/config';

let redisDbIndex = 1;

export const TestConfigModule = ConfigModule.forRoot({
  ignoreEnvFile: true,
  load: [
    () => ({
      REDIS_URI: `redis://127.0.0.1:6379/${redisDbIndex++}`,
    }),
  ],
});
