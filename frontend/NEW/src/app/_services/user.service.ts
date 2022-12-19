import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../_models/User';
import { Observable, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get(this.baseUrl + 'users', this.jwt()).pipe(
      map((response) => response as User[]),
      catchError(this.handleError)
    );
  }

  getUser(id): Observable<User> {
    return this.http.get<User>(this.baseUrl + 'users/' + id).pipe(
      map((response) => response),
      catchError(this.handleError)
    );
  }

  updateUser(id: number, user: User) {
    return this.http
      .put(this.baseUrl + 'users/' + id, user)
      .pipe(catchError(this.handleError));
  }

  private jwt() {
    const token = localStorage.getItem('token');

    if (token) {
      const headers = new HttpHeaders({
        Authorization: 'Bearer ' + JSON.parse(token).tokenString,
        'Content-type': 'application/json',
      });
      return { headers };
    }
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
