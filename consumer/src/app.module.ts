import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TEST_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'hero-worker',
            brokers: ['kafka:29092'],
          },
          consumer: {
            groupId: 'hero-consumer-return'
          },
        }
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
