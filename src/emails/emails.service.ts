import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer/dist';
import { PruebaDto } from './dto/pruebaMail.dto';
import { CommonService } from '../common/common.service';

@Injectable()
export class EmailService {
  constructor(
    private mailerService: MailerService,
    private commonService: CommonService
  ) {}

  async send_register_mail(pruebaMail: PruebaDto) {
    try {
      await this.mailerService.sendMail({
        to: pruebaMail.user,
        from: `"Conexaflix" <${process.env.MAIL_FROM}>`,
        subject: 'Registro exitoso en conexaflix',
        template: './registro', 
        context: { 
          name: pruebaMail.name,
        },
      });
    } catch (error) {
      console.log('error al eviar el correo',error.message)
    }
  }
}