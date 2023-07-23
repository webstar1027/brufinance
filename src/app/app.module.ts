import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChainlinkAPIService } from './common/services/chainlink-api.service';
import { ScanApiService } from './common/services/scan-api.service';
import { Web3Service } from './common/services/web3.service';
import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './common/components/header/header.component';
import { ContentComponent } from './common/components/layouts/content/content.component';
import { FullComponent } from './common/components/layouts/full/full.component';

import {
  SocialLoginModule,
  SocialAuthServiceConfig,
} from 'angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider,
} from 'angularx-social-login';

import { AuthHttpInterceptor } from './common/interceptors/auth-http.interceptor';

import { environment } from '../environments/environment';
import { FormBuilder, FormsModule } from '@angular/forms';
import { NumberWithCommaPipe } from './common/pipes/number-with-comma.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ContentComponent,
    FullComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgbModule,
    SocialLoginModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
    Web3Service,
    ScanApiService,
    ChainlinkAPIService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.googleClientId),
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider(environment.facebookClientId),
          },
        ],
      } as SocialAuthServiceConfig,
    },
    FormBuilder
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
