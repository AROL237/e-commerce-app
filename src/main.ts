import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { globalExceptionHandler } from './Exceptions/global.exception';
import { AuthRequestFilterMiddleware } from './middleware/auth-request-filter/auth-request-filter.middleware';
import { AuthGuard } from './gaurd/auth/auth.guard';
import { UsernamePasswordAuthentication } from './security/UsernamePasswordAuthentication.filter';
import { JwtAuthenticationFilter } from './security/JwtAuthentication.filter';
import { Body } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const authGuard = new AuthGuard(
    app.get(UsernamePasswordAuthentication),
    app.get(JwtAuthenticationFilter),
  );
  app.use(new AuthRequestFilterMiddleware().use);

  app.useGlobalGuards(authGuard);
  app.useGlobalFilters(new globalExceptionHandler());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
