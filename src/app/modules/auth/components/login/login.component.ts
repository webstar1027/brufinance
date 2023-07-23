import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  submittingLogin: boolean = false;
  loginErrorMessage: string = '';

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {}

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  showError(control: AbstractControl) {
    return control.errors && (control.touched || control.dirty);
  }

  handleLoginSuccess() {
    this.submittingLogin = false;
    this.router.navigateByUrl('/dashboard');
  }

  handleLoginFail(err: any) {
    this.submittingLogin = false;

    if (err.status === 400) {
      this.loginErrorMessage = 'Invalid Email or Password';
      return;
    }

    if (!err.ok) {
      this.loginErrorMessage = 'Something went wrong! Please try again';
    }
  }

  onLogin() {
    console.log("login...")
    if (this.loginForm.invalid) return;

    this.submittingLogin = true;

    const { email, password } = this.loginForm.value;
    console.log("onLogin", email, password);

    this.authService.login(email, password).subscribe(
      () => {
        this.submittingLogin = false;
        this.router.navigateByUrl('/dashboard');
      },
      (err) => this.handleLoginFail(err)
    );
  }

  handleGoogleSignIn() {
    this.authService.googleSignIn().subscribe(
      (response) => {
        this.handleLoginSuccess();
      },
      (err) => {
        this.handleLoginFail(err);
      }
    );
  }

  handleFacebookSignIn() {
    this.authService.facebookSignIn().subscribe(
      (response) => {
        this.handleLoginSuccess();
      },
      (err) => {
        this.handleLoginFail(err);
      }
    );
  }
}
