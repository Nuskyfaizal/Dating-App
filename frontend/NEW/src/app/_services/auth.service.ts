import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { User } from '../Models/userModel';

@Injectable()
export class AuthService {
  // private userSubject: BehaviorSubject<User>;
  // public user: Observable<User>;

  baseUrl = 'https://localhost:7080/api/auth/';
  userToken: any;

  constructor(private http: HttpClient) {
    // //this.userSubject = new BehaviorSubject<User>(
    //   JSON.parse(localStorage.getItem('user'))
    // );
    // this.user = this.userSubject.asObservable();
  }

  login(model: any) {
    return this.http.post(this.baseUrl + 'login', model).pipe(
      map((response) => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        const user = response;
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.userToken = user;
        }
      }) //.catch(this.handleError);
    );
  }

  register(models: any) {
    return this.http.post(this.baseUrl + 'register', models);
  }

  // private handleError(error:any) {
  //   const applicationError = error.headers.get('Application-Error');
  //   if(applicationError){
  //     return Observable.throw(applicationError);
  //   }
  //   const serverError = error.json();
  //   let modelStateErrors = "";
  //   if(serverError){
  //     for(const key in serverError){
  //       if(serverError[key]) {
  //         modelStateErrors += serverError[key] + '\n';
  //       }
  //     }
  //   }
  //   return Observable.throw(
  //     modelStateErrors || 'Server Error'
  //   );
}
