import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { UserEntity } from '../persistence/entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  /**
   * Email de bienvenida tras crear una cuenta.
   * Plantilla: src/mail/templates/confirmation.hbs
   * Variables de la plantilla: name, anno
   */
  async sendUserConfirmation(user: UserEntity): Promise<void> {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Bienvenido a SACP',
      template: 'confirmation', // la extensión `.hbs` se añade automáticamente
      context: {
        name: user.userName,
        anno: new Date().getFullYear(),
      },
    });
  }

  /**
   * Email con el código de recuperación de contraseña.
   * Plantilla: src/mail/templates/request-password.hbs
   * El código lo genera y expira (24 h) AuthService.requestPasswordReset.
   * Variables de la plantilla: name, code, anno
   */
  async sendPasswordResetEmail(user: UserEntity, code: number): Promise<void> {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Recuperación de contraseña · Tu código de acceso',
      template: 'request-password',
      context: {
        name: user.userName,
        code: String(code),
        anno: new Date().getFullYear(),
      },
    });
  }
}
