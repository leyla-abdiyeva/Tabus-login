import {Component, inject, signal, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgClass} from '@angular/common';
import {Router} from '@angular/router';
import {AuthService} from '../../core/auth/auth.service';
import {catchError, Observable, of} from 'rxjs';
import {StoreService} from '../../core/services/store/store.service';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    NgClass,
  ],

  templateUrl: './login.component.html',
  standalone: true,
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private storeService = inject(StoreService);
  private cookieService = inject(CookieService);
  // isSignedIn$: Observable<boolean>;
  showPassword = false;
  showCompanyKey = false;

  loginError = signal(false);

  constructor() {
    // this.isSignedIn$ = this.authService.isUserSignedIn();
  }

  // Check if the user is already logged in
  ngOnInit() {
    // this.storeService.initService();
  }


  loginForm = new FormGroup({
    companyKey: new FormControl('dev', Validators.required),
    username: new FormControl('Leyla', Validators.required),
    password: new FormControl('12345', Validators.required),
  });

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleCompanyKey(): void {
    this.showCompanyKey = !this.showCompanyKey;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const companyKey = this.loginForm.value.companyKey ?? '';
    const username = this.loginForm.value.username ?? '';
    const password = this.loginForm.value.password ?? '';

    if (username && password && companyKey) {
      this.authService
        .login(username, password, companyKey)
        .pipe(
          catchError(() => {
            this.loginError.set(true);
            return of(null);
          })
        )
        .subscribe((response) => {
          if (response && response !== 'error') {
            alert("response gəldi");
            console.log(response);

            // Call the StoreService action logger here
            this.storeService.actionsStore(response);

            this.loginError.set(false);

            if (response.token) {
              localStorage.setItem('token', response.token);
              this.cookieService.set('uID_i', response.token, new Date(Date.now() + 3600 * 1000), '/');
              console.log('Token saved to cookie and localStorage');
            }

            this.storeService.actionsStore(response);
            this.storeService.initService();

            if (response.username != null) {
              console.log('Login successful!');
              // Optional: this.router.navigate(['/main']);
            } else if (response.code === 401) {
              alert('Username or password is incorrect!');
            }
          } else {
            console.warn("Login failed or returned 'error'");
          }
        });
    } else {
      alert("error" + 122222);
      this.loginError.set(true);
    }
  }


}
