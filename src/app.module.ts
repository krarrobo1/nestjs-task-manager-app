import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
// Database ORM
import {TypeOrmModule} from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';




@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TasksModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
