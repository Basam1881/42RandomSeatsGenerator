import {
  Controller,
  Get,
  Redirect,
  Render,
  Req,
  UseGuards,
  Session,
} from '@nestjs/common';
import { User } from './login/user.decorator';
import { Profile } from 'passport-42';
import { AuthenticatedGuard } from './login/guards/authenticated.guard';
import { Request } from 'express';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map } from 'rxjs';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly httpService: HttpService, private readonly appservice: AppService) {}

  @Get()
  @Render('home')
  home(@User() user: Profile) {
    return { user };
  }

  @Get('login')
  @Render('login')
  logIn() {
    return;
  }

  @Get('mail')
  mailer() {
    this.appservice.example();
  }

  @Get('profile')
  @UseGuards(AuthenticatedGuard)
  @Render('profile')
  profile(@User() user: Profile) {
    return { user };
  }

  @Get('data')
  @UseGuards(AuthenticatedGuard)
  @Render('data')
  async data(@User() user: Profile, @Session() session: Record<string, any>) {
    const accessToken: string = session.accessToken;
    console.log(accessToken);
    const data$ = this.httpService
      .get('https://api.intra.42.fr/v2/campus', {
        headers: {
          authorization: 'bearer ' + accessToken,
        },
      })
      .pipe(
        map((response) =>
          response.data
            .sort((a: any, b: any) => (a.id > b.id ? 1 : -1))
            .map((item: any) => {
              if (!item.website.match(/^http/)) {
                item.website = 'https://' + item.website;
              }
              return item;
            }),
        ),
      );
    const data = await firstValueFrom(data$);
    return { user, data };
  }

  @Get('campus_users')
  // @UseGuards(AuthenticatedGuard)
  // @Render('user')
  async user(@Req() req: Request) {
    const accessToken: string = req.headers.authorization;
    this.appservice.accessToken = accessToken;
    // console.log(req.headers);
    // console.log(accessToken);
        // let getExamUsers: any = [];
        // let morePagesAvailable = true;
        // let currentPage = 0;

        // while(morePagesAvailable) {
        //   currentPage++;
        //   const response = await fetch(`http://api.dhsprogram.com/rest/dhs/data?page=${currentPage}`)
        //   let { data, total_pages } = await response.json();
        //   data.forEach(e => getExamUsers.unshift(e));
        //   morePagesAvailable = currentPage < total_pages;
        // }      
        // return getExamUsers;

    const getExams: any = this.httpService
      .get('https://api.intra.42.fr/v2/campus/43/exams', {
        headers: { authorization: accessToken }}).pipe(map((response) => response.data));
    // const getUserLocations: any = this.httpService
    //   .get('https://api.intra.42.fr/v2/users/88405/locations?per_page=5', {
    //     headers: { authorization: accessToken }}).pipe(map((response) => response.data));


    // main data
    const exams = await firstValueFrom(getExams);
    // const userLocations = await firstValueFrom(getUserLocations);

    // this.appservice.seatsGenerator(exams, userLocations);
    // console.log(examUsers.length)
    // for (let i = 0; i < examUsers.length; i++) {
    //   console.log(examUsers[i].user.login);
    // }
    // getExamUsers.forEach(function(e) {
    //   console.log(e.user.login);
    // });
    return this.appservice.seatsGenerator(exams);
  }

  @Get('logout')
  @Redirect('/')
  logOut(@Req() req: Request) {
    req.logOut(()=>{});
  }
}
