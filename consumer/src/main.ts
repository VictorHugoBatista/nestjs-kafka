import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
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
  app.listen(() => console.log('Kafka consumer service is listening!'))

  const app2 = await NestFactory.create(AppModule);
  await app2.listen(3001);
}
bootstrap();

