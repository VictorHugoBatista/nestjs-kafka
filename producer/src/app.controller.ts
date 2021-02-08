import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('TEST_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    // Need to subscribe to topic 
    // so that we can get the response from kafka microservice
    this.kafkaClient.subscribeToResponseOf('topic-test');
    await this.kafkaClient.connect();
  }

  @Get()
  getHello(): string {
    this.kafkaClient.emit<object>('topic-test', {number: 5});
    console.log('send teste');
    return this.appService.getHello();
  }

  @MessagePattern('topic-test-return') // Our topic name
  helloTopic(@Payload() message) {
    console.log('return', message.value);
    return message.value;
  }
}
