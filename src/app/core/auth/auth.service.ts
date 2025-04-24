import {inject, Injectable, OnInit} from '@angular/core';
import {Observable, of, tap} from 'rxjs';
import {Router} from '@angular/router';
import {catchError} from 'rxjs/operators';
import {StoreService} from '../services/store/store.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private storeService = inject(StoreService);

  constructor() {
  }

  // Login Method - Login and save token and user data
  login(username: string, password: string, skey: string): Observable<any> {
    const sendDatas = {
      skey: skey,
      username: username,
      password: password,
      frontend_post: 'login'  // Use this action to identify the login request on the backend
    };

    return this.storeService.onLoadData(sendDatas).pipe(
      tap(response => {
        if (response !== 'error') {
          localStorage.setItem('token', response.token);  // Store the token
          localStorage.setItem('userData', JSON.stringify(response.userData));  // Store user data

          // Always set required values
          if (!localStorage.getItem('entity')) {
            localStorage.setItem('entity', 'dev');
          }
          if (!localStorage.getItem('langSyst')) {
            localStorage.setItem('langSyst', 'en');
          }

          this.router.navigate(['/main']);  // Navigate after successful login
        } else {
          console.log('Login failed');
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        return of('error');
      })
    );
  }
}
