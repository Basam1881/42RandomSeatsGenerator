import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
// import { User } from './../user/user.entity';

type User = {
  login: string
  usual_full_name:string
  location: string
  email: string
}

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

    sendUserConfirmation(user: User/* , token: string */) {
    // const url = `example.com/auth/confirm?token=${token}`;

     this.mailerService.sendMail({
      to: user.email,
      // from: 'bassam1881999@gmail.com',
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Nice App! Confirm your Email',
      text: 'welcome from my first mail sender', // plaintext body
      // html: '<b>welcome again from my first mail sender</b>', // HTML body content
      template: './confirmation', // `.hbs` extension is appended automatically
      context: { // ✏️ filling curly brackets with content
        name: "BNAJI"/* user.name */,
        // url,
      },
    }).then((r) => {
      console.log(r);
    })
    .catch(() => {});



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