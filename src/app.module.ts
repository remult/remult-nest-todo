import { MiddlewareConsumer } from '@nestjs/common';
import { NestModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { Remult } from 'remult';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RemultFactoryService, RemultMiddleware } from './remult.middleware/remult.middleware';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [AppController],
  providers: [AppService,
    RemultFactoryService,
    {
      provide: Remult,
      useFactory: (factory: RemultFactoryService) => factory.getRemult(),
      inject: [RemultFactoryService]
    }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RemultMiddleware)
      .forRoutes('/api');
  }
}
