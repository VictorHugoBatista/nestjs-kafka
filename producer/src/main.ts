import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['host.docker.internal:9094'],
      },
      consumer: {
          groupId: 'hero-consumer-return',
      }
    }
  });
  await app.startAllMicroservicesAsync();
  await app.listen(3000, () => console.log('Server is up!'));
}
bootstrap();
