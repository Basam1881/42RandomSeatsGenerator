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
// import { User } from './login/user.decorator';
import { Profile } from 'passport-42';
import { firstValueFrom, map } from 'rxjs';
import { MailerService } from '@nestjs-modules/mailer';
import { MailService } from './mail/mail.service';
import { User, ExamUser } from './app.interface'

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService, private readonly mailService: MailService) {}


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
  private usersExample: User[] = [];
  private labMax: number = 3;
  private rawMax: number = 14;
  public accessToken: string;
  public baseURL: string;
  public examID: number;
  public type: string;
  public typeID: number;
  public typeUsers: string;

  sendEmails(user: User[], exam: any): void {
    for (let i: number = 0; i < user.length; i++) {
      this.mailService.sendUserConfirmation(user[i], exam);
    }
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
    let examUsers = JSON.parse(JSON.stringify(examUsersTmp)) as typeof examUsersTmp;
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

  setAvailableLabs(exam: any) {
    if (exam.location.search('Lab1') !== -1) {
      const raw = this.clusters[0].length;
      const seats = this.rawMax;
      this.setLabAvailable(0, raw, seats);
    }
    if (exam.location.search('Lab2') !== -1) {
      const raw = this.clusters[1].length;
      const seats = this.rawMax;
      this.setLabAvailable(1, raw, seats);
    }
    if (exam.location.search('Lab3') !== -1) {
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

  getLocationString() {

  }

  async setSeat(user: ExamUser) {
    for (let i: number = 0; i < this.pairs.length; i++) {
      for (let lab: number = 0; lab < this.labMax; lab++) {
        for (let raw: number = 0; raw < this.clusters[lab].length; raw++) {
          for (let j: number = 0; j < this.pairs[i].length; j++) {

            if (this.clusters[lab][raw][this.pairs[i][j]] === 0) {
              const userLocation: string = `lab${lab + 1}r${raw + 1}s${this.pairs[i][j] + 1}`;
              // console.log(location);
              // if (await this.isUserValidForLocation(user, location) === false)
              //   return null;
              this.users.push({login: user.login, usual_full_name: user.usual_full_name, location: userLocation, email: user.email});
              this.clusters[lab][raw][this.pairs[i][j]] = 1;
              // return location;
            }

          }
        }
      }
    }
    // return null;
  }

  // unsetSeat(user: ExamUser) {
  //   for (let i: number = 0; i < this.pairs.length; i++) {
  //     for (let lab: number = 0; lab < this.labMax; lab++) {
  //       for (let raw: number = 0; raw < this.clusters[lab].length; raw++) {
  //         for (let j: number = 0; j < this.pairs[i].length; j++) {

  //           if (this.clusters[lab][raw][this.pairs[i][j]] === 0) {
  //             const location: string = 'lab' + (lab + 1).toString() + 'r' + (raw + 1).toString() + 's'+ (this.pairs[i][j] + 1).toString();
  //             this.users.push({id: user.id, login: user.login, usual_full_name: user.usual_full_name, location, email: user.email});
  //             this.clusters[lab][raw][this.pairs[i][j]] = 1;
  //             return location;
  //           }

  //         }
  //       }
  //     }
  //   }
  // }

  async isUserValidForLocation(user: ExamUser, location: string) {
    const per_page: number = 5;
    const getUserLocations: any = this.httpService
    .get(`https://api.intra.42.fr/v2/users/${user.login}/locations?per_page=${per_page}`, {
      headers: { authorization: this.accessToken }}).pipe(map((response) => response.data));
    const userLocations: any = await firstValueFrom(getUserLocations);
    // console.log('hello');
    for (let i: number = 0; i < userLocations.length; i++) {
      if (userLocations[i].host === location) {
        console.log ('User ' + user.login + ' is not valid for ' + location);
        return false;
      }
    }
    console.log ('User ' + user.login + ' is valid for ' + location);
    return true;
  }

  bruteForce(examUsers: any) {
    for (let i: number = 0; i < examUsers.length; i++) {
      this.setSeat(examUsers[i].user);
    }
  }

  async seatsGenerator(exam: any) {
    this.resetCluster();
    this.setAvailableLabs(exam);

    const per_page: number = 100;
    let page: number = 1;
    let length: number = per_page;

    while (length === per_page) {
      let getExamUsers: any = this.httpService
      .get(`${this.baseURL}/${this.type}/${this.typeID}/${this.typeUsers}?per_page=${per_page}&page=${page}`, {
        headers: { authorization: this.accessToken }}).pipe(map((response) => response.data));
      let examUsersTmp: any = await firstValueFrom(getExamUsers);
      let examUsers: any = this.getRandomExamUsers(examUsersTmp);
      page++;
      this.bruteForce(examUsers);
      console.log(examUsers.length);
      length = examUsers.length;
    }
    this.usersExample.push({login: "bnaji", usual_full_name: "Bassam Naji", location: "lab1r1s3" , email: 'bassam1881999@gmail.com'});
    // this.usersExample.push({login: "bnaji", usual_full_name: "Bassam Naji", location: "lab1r1s12" , email: 'bnaji1881999f@gmail.com'});
    // this.usersExample.push({login: "bnaji", usual_full_name: "Bassam Naji", location: "lab1r1s12" , email: 'bnaji@student.42abudhabi.ae'});
    this.sendEmails(this.usersExample, exam);
    this.printClusters();
    return this.users;
  }
}
