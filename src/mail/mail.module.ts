import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../app.keys';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get(AppConfig.EMAIL_SMTP),
          secure: configService.get(AppConfig.EMAIL_SECURE),
          port: configService.get(AppConfig.EMAIL_PORT),
          auth: {
            user: configService.get(AppConfig.EMAIL_ID),
            pass: configService.get(AppConfig.EMAIL_PASS),
          },
        },
        defaults: {
          from: `"No Reply" <${configService.get(AppConfig.EMAIL_FROM)}>`,
        },
        template: {
          dir: process.cwd() + '/dist/mail/templates',
          adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
