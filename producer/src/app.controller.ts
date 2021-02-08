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
    this.kafkaClient.subscribeToResponseOf('topic-test');
    this.kaftaProducer = await this.kafkaClient.connect();
  }

  @Get()
  getHello() {
    this.kafkaClient.send('topic-test', {number: 5}).subscribe();
    console.log('send to topic-test');
    return this.appService.getHello();
  }

  @MessagePattern('topic-test.reply') // Our topic name
  helloTopic(@Payload() message) {
    console.log('return', message.value);
    return message.value;
  }
}
