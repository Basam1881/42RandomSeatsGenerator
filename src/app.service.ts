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
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
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
  private rawMax: number = 14;

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
  
  setLabAvailable(lab: number, raws: number, seats: number) {
    for (let rawCnt: number = 0; rawCnt < raws; rawCnt++) {
      for (let seatCnt: number = 0; seatCnt < seats; seatCnt++) {
        this.clusters[lab][rawCnt][seatCnt] = 0;
      }
    }
  }

  setAvailableLabs(exams: any) {
    if (exams[0].location.search('Lab1') !== -1) {
      const raw = this.clusters[0].length;
      const seats = this.rawMax;
      this.setLabAvailable(0, raw, seats);
    }
    if (exams[0].location.search('Lab2') !== -1) {
      const raw = this.clusters[1].length;
      const seats = this.rawMax;
      this.setLabAvailable(1, raw, seats);
    }
    if (exams[0].location.search('Lab3') !== -1) {
      const raw = this.clusters[1].length;
      const seats = this.rawMax;
      this.setLabAvailable(2, raw, seats);
    }
  }

  printClusters() {
    for (let labCnt: number = 0; labCnt < this.clusters.length; labCnt++) {
      console.log('----------------------------------------');
      console.log('Lab' + (labCnt + 1) + ':');
      for (let rawCnt: number = 0; rawCnt < this.clusters[labCnt].length; rawCnt++) {
        console.log();
        for (let seatCnt: number = 0; seatCnt < this.clusters[labCnt][rawCnt].length; seatCnt++) {
          process.stdout.write(this.clusters[labCnt][rawCnt][seatCnt] + ' ');
        }
      }
      console.log('\n----------------------------------------');
    }
  }

  resetCluster() {
    for (let labCnt: number = 0; labCnt < this.clusters.length; labCnt++) {
      for (let rawCnt: number = 0; rawCnt < this.clusters[labCnt].length; rawCnt++) {
        for (let seatCnt: number = 0; seatCnt < this.clusters[labCnt][rawCnt].length; seatCnt++) {
          this.clusters[labCnt][rawCnt][seatCnt] = -1;
        }
      }
    }
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
                let location: string = 'lab' + (lab + 1).toString() + 'r' + (raw + 1).toString() + 's'+ (this.pairs[i][j] + 1).toString();
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
    this.resetCluster();
    // this.printClusters();
    this.setAvailableLabs(exams);
    this.printClusters();
    
    for (let i: number = 0; i < 30; i++) {
      console.log(i);
      this.getSeat(examUsers[i].user);
    }
    return this.users;
  }
  
}
