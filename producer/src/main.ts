import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app2 = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['kafka:29092'],
      },
      consumer: {
          groupId: 'hero-consumer-return',
      }
    }
  });
  app2.listen(() => console.log('Kafka consumer service is listening!'));

  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
