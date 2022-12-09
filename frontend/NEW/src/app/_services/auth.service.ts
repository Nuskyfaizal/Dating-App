import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
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
        localStorage.setItem('user', JSON.stringify(user));
        this.userToken = user;
      })
    );
  }

  register(models: any) {
    return this.http.post(this.baseUrl + 'register', models);
  }
}
