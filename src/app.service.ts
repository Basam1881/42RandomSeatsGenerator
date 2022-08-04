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

export interface ExamUser {
  id:                number;
  email:             string;
  login:             string;
  first_name:        string;
  last_name:         string;
  usual_full_name:   string;
  usual_first_name:  null;
  url:               string;
  phone:             string;
  displayname:       string;
  image_url:         string;
  new_image_url:     string;
  "staff?":          boolean;
  correction_point:  number;
  pool_month:        string;
  pool_year:         string;
  location:          null;
  wallet:            number;
  anonymize_date:    Date;
  data_erasure_date: Date;
  created_at:        Date;
  updated_at:        Date;
  alumnized_at:      null;
  "alumni?":         boolean;
}

type User = {
  id: number
  login: string
  usual_full_name:string
  location: string
  email: string
}

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}


  private clusters: number[][][] = [
    [ // Lab 1
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ],
    [ // Lab 2
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
    ],
    [ // Lab 3
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
    ]
  ];
  private pairs: number[][] = [
    [2, 11],
    [6, 7],
    [4, 9],
    [0, 13],
    [5, 8],
    [1, 12],
    [3, 10]
  ];
  private users: User[] = [];
  private labMax: number = 3;
  // private rawMax: number = 14;

  getExamsUsers(accessToken: string) {
      const getExamUsers: any = this.httpService
      .get('https://api.intra.42.fr/v2/events/11374/events_users', {
        headers: {
          authorization: accessToken,
        },
      })
      .pipe(
        map((response) =>
          response.data
        ),
      );
      // const examUsers = await firstValueFrom(getExamUsers);
      // console.log(examUsers[0].user.login);
      return { getExamUsers };
  }

  getLastWeekDate() {
    const now = new Date();
    let date_ob = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);

    let day = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let date = year + "-" + month + "-" + day;
    
    return date;
  }

  getLastCurrentDate() {
    const now = new Date();
    let date_ob = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);

    let day = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let date = year + "-" + month + "-" + day;

    return date;
  }

  getRandomExamUsers(examUsersTmp: any) {
    const examUsers = JSON.parse(JSON.stringify(examUsersTmp)) as typeof examUsersTmp;
    const length: number = examUsersTmp.length;
    for (let i: number = 0; i != length; i++) {
      let index: number = Math.floor(Math.random() * examUsersTmp.length);
      examUsers[i] = examUsersTmp[index];
      examUsersTmp.splice(index, 1);
    }
    return examUsers;
  }

  getSeat(user: ExamUser) {
    for (let i: number = 0; i < this.pairs.length; i++) {
      for (let lab: number = 0; lab < this.labMax; lab++) {
        for (let raw: number = 0; raw < this.clusters[lab].length; raw++) {
          for (let j: number = 0; j < this.pairs[i].length; j++) {
            // console.log(lab);
            // console.log(raw);
            // console.log(this.pairs[i][j]);
            // console.log("-------");
            if (this.clusters[lab][raw][this.pairs[i][j]] === 0) {
              // console.log("-------");
              // console.log("lab" + i + "raw" + raw + "s" +this.pairs[i][j]);
                let location: string = 'lab' + lab.toString() + 'r' + raw.toString() + 's'+ this.pairs[i][j];
              // console.log({id: user.id, login: user.login, usual_full_name: user.usual_full_name, location, email: user.email})
              this.users.push({id: user.id, login: user.login, usual_full_name: user.usual_full_name, location, email: user.email});
              this.clusters[lab][raw][this.pairs[i][j]] = 1;
              return location;
            }
          }
        }
      }
    }
    return 'FULL';
  }

  seatsGenerator(examUsers: any, exams: any, userLocations: any) {
    for (let i: number = 0; i < 30; i++) {
      this.getSeat(examUsers[i].user);
    }
    return this.users;
  }
  
}
