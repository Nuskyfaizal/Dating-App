import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class AuthService {
  baseUrl = 'http://localhost:5000/api/auth/';
  userToken: any;
  decodedToken: any;

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {}

  login(model: any) {
    // const headers = new HttpHeaders({ 'Content-type': 'application/json' });
    return this.http.post(this.baseUrl + 'login', model).pipe(
      map((response: any) => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        const user = response;
        if (user) {
          let token = user.token;
          localStorage.setItem('token', token);
          this.decodedToken = this.jwtHelper.decodeToken(token);
          console.log(this.decodedToken);
          this.userToken = user;
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
