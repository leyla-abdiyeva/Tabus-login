import {inject, Injectable, OnInit} from '@angular/core';
import {Observable, of, tap} from 'rxjs';
import {Router} from '@angular/router';
import {catchError} from 'rxjs/operators';
import {StoreService} from '../store/store.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private storeService = inject(StoreService);

  constructor() {
  }

  // Login Method - Login and save token and user data
  login(username: string, password: string, companyKey: string): Observable<any> {
    const sendDatas = {
      companyKey: companyKey,
      username: username,
      password: password,
      frontend_post: 'login'  // Use this action to identify the login request on the backend
    };

    return this.storeService.onLoadData(sendDatas).pipe(
      tap(response => {
        if (response !== 'error') {
          console.log('Login successful!', response);
          localStorage.setItem('token', response.token);  // Store the token
          localStorage.setItem('userData', JSON.stringify(response.userData));  // Store user data

          // Always set required values
          if (!localStorage.getItem('entity')) {
            localStorage.setItem('entity', 'main');
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

  // Initialization Method - Handle the initialization action
  initialization(token: string, entity: string, langSyst: string): Observable<any> {
    const sendDatas = {
      token: token,
      entity: entity,
      langSyst: langSyst,
      frontend_post: 'initialization'  // Action type for initialization
    };

    return this.storeService.onLoadData(sendDatas).pipe(
      tap(response => {
        if (response && response !== 'error') {
          console.log('Initialization successful!', response);
          // Store any necessary data from initialization (e.g., user data, menu data)
          localStorage.setItem('userData', JSON.stringify(response.userData));
          localStorage.setItem('menuData', JSON.stringify(response.menuData));
          localStorage.setItem('favoritesData', JSON.stringify(response.favoritesData));
          localStorage.setItem('infoData', JSON.stringify(response.infoData));
        } else {
          console.log('Initialization failed');
        }
      }),
      catchError(error => {
        console.error('Initialization error:', error);
        return of('error');
      })
    );
  }
}
