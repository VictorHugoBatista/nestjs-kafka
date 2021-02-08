import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['host.docker.internal:9094'],
      },
      consumer: {
          groupId: 'hero-consumer',
      }
    }
  });
  await app.startAllMicroservicesAsync();
  await app.listen(3001, () => console.log('Server is up!'));
}
bootstrap();

