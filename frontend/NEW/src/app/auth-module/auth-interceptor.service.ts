// import { Injectable, Injector, NgModule } from '@angular/core';
// import {
//   HttpInterceptor,
//   HttpRequest,
//   HttpHandler,
//   HttpEvent,
// } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { AuthService } from '../_services/auth.service';

// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {
//   constructor(private injector: Injector) {}

//   intercept(req, next) {
//     let token = localStorage.getItem('token');

//     const cloned = req.clone({
//       headers: {
//         Authorization: 'Bearer ' + token,
//       },
//     });

//     return next.handle(cloned);
//   }
// }
