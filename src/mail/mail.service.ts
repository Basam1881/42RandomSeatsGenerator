import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User, Exam } from '../app.interface';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

    sendUserConfirmation(user: User, exam: Exam/* , token: string */) {
    // const url = `example.com/auth/confirm?token=${token}`;
    console.log(`<--------------- Exam ----------------->`);
    console.log(exam.projects[0].name);
    console.log(`<---------------      ----------------->`);
     this.mailerService.sendMail({
      to: user.email,
      // from: 'bassam1881999@gmail.com',
      // from: '"Support Team" <support@example.com>', // override default from
      subject: `Exam seat`,
      // text: 'welcome from my first mail sender', // plaintext body
      // html: '<b>welcome again from my first mail sender</b>', // HTML body content
      template: './confirmation', // `.hbs` extension is appended automatically
      context: { // ✏️ filling curly brackets with content
        name: user.login,
        location: user.location,
        examName: exam.projects[0].name,

        // url,
      },
    }).then((r) => {
      console.log(r);
    })
    .catch(() => {
      console.log('error');
    });



    // this.mailerService
    //   .sendMail({
    //     to: 'bassam1881999@gmail.com', // list of receivers
    //     from: 'bassam1881999@gmail.com', // sender address
    //     subject: 'Testing Nest MailerModule ✔', // Subject line
    //     text: 'welcome from my first mail sender', // plaintext body
    //     html: '<b>welcome again from my first mail sender</b>', // HTML body content
    //   })
    //   .then((r) => {
    //     console.log(r);
    //   })
    //   .catch(() => {});
  }
}