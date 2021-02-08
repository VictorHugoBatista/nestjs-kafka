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
    this.kaftaProducer = await this.kafkaClient.connect();
  }

  @Get()
  getHello(): string {
    this.kaftaProducer.send({
      topic: 'topic-test.reply',
      messages: [
        {
          key: Math.random().toString(),
          value: JSON.stringify({teste: 'connect1'}),
        },
      ],
    });
    console.log('send test connection')
    return this.appService.getHello() + ' teste consumer';
  }

  @MessagePattern('topic-test') // Our topic name
  helloTopic(@Payload() message) {
    console.log('message', message.value, Math.random());
    this.sleep(20000);
    return {result: message.value.number * 3};
  }

  sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
  }
}
