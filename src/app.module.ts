import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configValidationSchema } from './config.schema';
import { LoginModule } from './login/login.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [ 
      ConfigModule.forRoot({
        envFilePath: '.env',
        validationSchema: configValidationSchema,
      }),
    MailModule,
  //   MailerModule.forRoot({
  //   transport: {
  //     service: 'gmail',
  //     // host: '42 mail server'
  //     // port: 1025,
  //     // ignoreTLS: true,
  //     // secure: false,
  //     auth: {
  //       user: process.env.MAIL_USER,
  //       pass: process.env.MAIL_PASSWORD,
  //     },
  //   },
  //   defaults: {
  //     from: '"No Reply" <bassam1881999@gmail.com>',
  //   },
  //   preview: true,
  //   template: {
  //     dir: process.cwd() + '/template/',
  //     adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
  //     options: {
  //       strict: true,
  //     },
  //   },
  // }),
    LoginModule,  
    HttpModule, MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
