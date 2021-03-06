import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as config from 'config';

async function bootstrap() {
  const serverConfig = config.get('server');
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  
  if(process.env.NODE_ENV === 'development') app.enableCors();
  
  const PORT = process.env.PORT || serverConfig.port;
  await app.listen(PORT);
  logger.log(`Server Listening on: ${PORT}`)
}
bootstrap();
