import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, finalize, share, filter } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';

import { environment } from '../../../../environments/environment';
import {
  SocialAuthService,
  GoogleLoginProvider,
  FacebookLoginProvider,
} from 'angularx-social-login';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private BASE_URL: string = environment.baseURL;

  user: any;
  loggedIn$ = new BehaviorSubject<any>(null);

  constructor(
    private http: HttpClient,
    private socialAuthService: SocialAuthService
  ) {}

  getLoginState() {
    return this.loggedIn$.asObservable();
  }

  login(email: string, password: string) {
    console.log(email, password);
    return this.http
      .post(`${this.BASE_URL}/api/v1/auth/login`, {
        email,
        password,
      })
      .pipe(
        tap(() => {
          this.loggedIn$.next(true);
        }),
        share()
      );
  }

  getProfile() {
    return this.http.get(`${this.BASE_URL}/api/v1/auth/profile`).pipe(
      tap((response: any) => {
        this.loggedIn$.next(true);
        this.user = response.data.user;
      }),
      share()
    );
  }

  googleSignIn() {
    
    return new Observable((subscriber) => {
      console.log("provider Id", GoogleLoginProvider.PROVIDER_ID)
      this.socialAuthService
        .signIn(GoogleLoginProvider.PROVIDER_ID, {scope: environment.googleClientId})
        .then((response) => {
          this.http
            .post(`${this.BASE_URL}/api/v1/auth/google-signin`, response)
            .pipe(
              tap((response: any) => {
                this.loggedIn$.next(true);
                this.user = response.data.user;
              }),
              share()
            )
            .subscribe(
              (response) => {
                subscriber.next(response);
              },
              (err) => {
                subscriber.error(err);
              }
            );
          console.log(response)
        })
        .catch((err) => {
          console.log(err)
          subscriber.error(err)
        });
    });
  }

  facebookSignIn() {
    return new Observable((subscriber) => {
      this.socialAuthService
        .signIn(FacebookLoginProvider.PROVIDER_ID)
        .then((response) => {
          this.http
            .post(`${this.BASE_URL}/api/v1/auth/facebook-signin`, response)
            .pipe(
              tap((response: any) => {
                this.loggedIn$.next(true);
                this.user = response.data.user;
              }),
              share()
            )
            .subscribe(
              (response) => {
                subscriber.next(response);
              },
              (err) => {
                subscriber.error(err);
              }
            );
        })
        .catch((err) => subscriber.error(err));
    });
  }

  googleLogout() {
    this.socialAuthService.signOut();
  }

  logout() {
    return this.http.post(`${this.BASE_URL}/api/v1/auth/logout`, {}).pipe(
      tap(() => {
        this.loggedIn$.next(false);
        this.user = null;
      })
    );
  }
}
