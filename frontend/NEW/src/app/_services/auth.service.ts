import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { User } from '../_models/User';

@Injectable()
export class AuthService {
  baseUrl = environment.apiUrl + 'auth/';
  userToken: any;
  decodedToken: any;
  currentUser: User;
  private photoUrl = new BehaviorSubject<string>('../../assets/user.jpg');
  currentPhotoUrl = this.photoUrl.asObservable();

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {}

  changeMemberPhoto(photoUrl: string) {
    this.photoUrl.next(photoUrl);
  }

  login(user: User) {
    // const headers = new HttpHeaders({ 'Content-type': 'application/json' });
    return this.http.post(this.baseUrl + 'login', user).pipe(
      map((response: any) => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        const user = response;
        if (user) {
          console.log(user);
          let token = user.token;
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user.user));
          this.decodedToken = this.jwtHelper.decodeToken(token);
          this.currentUser = user.user;
          this.userToken = user;
          if (this.currentUser.photoUrl != null) {
            this.changeMemberPhoto(this.currentUser.photoUrl);
          } else {
            this.changeMemberPhoto('../../assets/user.jpg');
          }
        }
      }),
      catchError(this.handleError)
    );
  }

  register(models: any) {
    return this.http
      .post(this.baseUrl + 'register', models)
      .pipe(catchError(this.handleError));
  }

  loggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }
    return !this.jwtHelper.isTokenExpired(token);
  }

  //handling exxception from server
  private handleError(error: HttpErrorResponse) {
    const applicationError = error.headers.get('Application-Error');
    if (applicationError) {
      return throwError(applicationError);
    }
    const serverError = error.error;
    let modelStateErrors = '';
    if (serverError) {
      for (const key in serverError) {
        if (serverError[key]) {
          modelStateErrors += serverError[key] + '\n';
        }
      }
    }
    return throwError(modelStateErrors || 'Server Error');
  }
}
