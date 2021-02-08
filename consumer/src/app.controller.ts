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
    this.kafkaClient.subscribeToResponseOf('topic-test-return');
    await this.kafkaClient.connect();
  }

  @Get()
  getHello(): string {
    this.kafkaClient.emit<object>('topic-test-return', {test: 'connection'});
    console.log('send test connection')
    return this.appService.getHello() + ' teste consumer';
  }

  @MessagePattern('topic-test') // Our topic name
  helloTopic(@Payload() message) {
    console.log('message', message.value);
    setTimeout(() => this.kafkaClient.emit<object>('topic-test-return', {result: 5 + 5}), 2000);
    return message.value;
  }
}
