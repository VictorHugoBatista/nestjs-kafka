import { Controller, Get, Inject, OnModuleInit } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { Producer } from '@nestjs/microservices/external/kafka.interface';

@Controller()
export class AppController implements OnModuleInit {
  private kaftaProducer: Producer;

  constructor(
    private readonly appService: AppService,
    @Inject('TEST_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    // Need to subscribe to topic 
    // so that we can get the response from kafka microservice
    this.kafkaClient.subscribeToResponseOf('topic-test-return');
    this.kaftaProducer = await this.kafkaClient.connect();
  }

  @Get()
  getHello(): string {
    this.kaftaProducer.send({
      topic: 'topic-test-return',
      messages: [
        {
          key: Math.random().toString(),
          value: JSON.stringify({teste: 'connect1'}),
        },
        {
          key: Math.random().toString(),
          value: JSON.stringify({teste: 'connect2'}),
        },
      ],
    });
    console.log('send test connection')
    return this.appService.getHello() + ' teste consumer';
  }

  @MessagePattern('topic-test') // Our topic name
  helloTopic(@Payload() message) {
    console.log('message', message.value);
    setTimeout(() => {
      this.kaftaProducer.send({
        topic: 'topic-test-return',
        messages: [
          {
            key: Math.random().toString(),
            value: JSON.stringify({result: 5 + 5}),
          },
        ],
      });
    }, 2000);
    return message.value;
  }
}
