import {
  Controller,
  Get,
  Redirect,
  Render,
  Req,
  UseGuards,
  Session,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { User } from './login/user.decorator';
import { Profile } from 'passport-42';
import { firstValueFrom, map } from 'rxjs';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getCampusUsers(@User() user: Profile, @Session() session: Record<string, any>) {
    const accessToken: string = session.accessToken;
    console.log(accessToken);
    const data$ = this.httpService
      .get('https://api.intra.42.fr/v2/campus/43/users', {
        headers: {
          authorization: 'bearer ' + accessToken,
        },
      })
      .pipe(
        map((response) =>
          response.data
        ),
      );
      // data$.forEach((item: any) => console.log(item.emails[0].value));
    const data = await firstValueFrom(data$);
    return { user, data };
  }
}
