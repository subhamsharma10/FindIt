
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ApiService } from '../core/api.service';
import { AuthService } from '../core/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="auth-shell">
      <div class="auth-visual">
        <div class="auth-visual-bg"></div>

        <div class="auth-visual-copy">
          <p class="eyebrow">FINDIT / CAMPUS COMMUNITY</p>

          @if (isRegister) {
            <h1>A little help<br />goes a <em>long way.</em></h1>
          } @else {
            <h1>Every lost thing<br />has a <em>story.</em></h1>
          }

          <p>
            One campus. A thousand little things.
            Let's help them find their way home.
          </p>

          <a routerLink="/" class="underlined-link">← Back to home</a>
        </div>
      </div>

      <div class="auth-form-wrap">
        <form class="auth-form" (ngSubmit)="submit()">
          <div class="section-kicker">
            {{ isRegister ? 'CREATE YOUR ACCOUNT' : 'WELCOME BACK' }}
          </div>

          <h2>{{ isRegister ? 'Join the community.' : 'Come on in.' }}</h2>

          <p class="form-intro">
            {{
              isRegister
                ? 'Create an account to report items and reconnect with their owners.'
                : 'Sign in to manage your reports and claims.'
            }}
          </p>

          @if (isRegister) {
            <label>
              Full name
              <input
                name="name"
                [(ngModel)]="name"
                required
                minlength="2"
                autocomplete="name"
                placeholder="Your name"
              />
            </label>
          }

          <label>
            Campus email
            <input
              name="email"
              type="email"
              [(ngModel)]="email"
              required
              autocomplete="email"
              placeholder="you@campus.edu"
            />
          </label>

          <label>
            Password
            <input
              name="password"
              type="password"
              [(ngModel)]="password"
              required
              minlength="8"
              [attr.autocomplete]="isRegister ? 'new-password' : 'current-password'"
              [placeholder]="isRegister ? 'At least 8 characters' : 'Your password'"
            />
          </label>

          @if (error) {
            <div class="alert-error" role="alert">{{ error }}</div>
          }

          @if (success) {
            <div class="alert-success" role="status">{{ success }}</div>
          }

          <button class="button auth-submit" type="submit" [disabled]="busy">
            {{
              busy
                ? 'Please wait…'
                : isRegister
                  ? 'Create account ↗'
                  : 'Sign in ↗'
            }}
          </button>

          <p class="auth-switch">
            {{ isRegister ? 'Already part of FindIt?' : 'New to FindIt?' }}
            <a [routerLink]="isRegister ? '/login' : '/register'">
              {{ isRegister ? 'Sign in' : 'Create an account' }}
            </a>
          </p>

          <p class="auth-security">
            Your account is used only to manage your FindIt activity.
          </p>
        </form>
      </div>
    </section>
  `,
  styles: [`
    .auth-shell {
      min-height: calc(100vh - 150px);
      display: grid;
      grid-template-columns: 1.05fr .95fr;
      background: #0b0808;
    }

    .auth-visual {
      position: relative;
      display: flex;
      align-items: end;
      min-height: 630px;
      padding: 70px;
      overflow: hidden;
    }

    .auth-visual-bg {
      position: absolute;
      inset: 0;
      background:
        linear-gradient(
          0deg,
          #0b0808 0%,
          #0b0808bb 35%,
          #0b08083b 100%
        ),
        url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80')
        center / cover;
      filter: saturate(.6);
    }

    .auth-visual-copy {
      position: relative;
      max-width: 600px;
    }

    .auth-visual h1 {
      font-size: clamp(55px, 6vw, 92px);
      margin: 28px 0;
    }

    .auth-visual-copy > p:not(.eyebrow) {
      color: #d1c5c2;
      max-width: 400px;
      line-height: 1.8;
      margin-bottom: 28px;
    }

    .auth-form-wrap {
      display: grid;
      place-items: center;
      padding: 55px 35px;
      background: #100b0b;
    }

    .auth-form {
      width: 100%;
      max-width: 430px;
    }

    .auth-form h2 {
      font-family: var(--serif);
      font-size: 42px;
      margin: 19px 0 12px;
    }

    .form-intro {
      color: #a99e9b;
      line-height: 1.7;
      font-size: 13px;
      margin-bottom: 30px;
    }

    .auth-form label,
    .form-field {
      display: flex;
      flex-direction: column;
      gap: 9px;
      margin-bottom: 19px;
      color: #e4dcd9;
      font-size: 12px;
      letter-spacing: .04em;
    }

    .auth-form input,
    .field-input,
    .field-select,
    .field-textarea {
      width: 100%;
      border: 1px solid #3a2929;
      background: #160f0f;
      color: #fff;
      padding: 14px 15px;
      outline: none;
      border-radius: 0;
      font: inherit;
      letter-spacing: 0;
      transition: border-color .2s;
    }

    .auth-form input:focus,
    .field-input:focus,
    .field-select:focus,
    .field-textarea:focus {
      border-color: var(--red);
    }

    .auth-form input::placeholder,
    .field-input::placeholder,
    .field-textarea::placeholder {
      color: #6f6260;
    }

    .auth-submit {
      width: 100%;
      margin-top: 8px;
    }

    .auth-submit:disabled {
      opacity: .6;
      cursor: wait;
    }

    .auth-switch {
      font-size: 12px;
      color: #a99e9b;
      margin: 25px 0;
      text-align: center;
    }

    .auth-switch a {
      color: #fff;
      text-decoration: underline;
      text-decoration-color: var(--red);
      text-underline-offset: 4px;
    }

    .auth-security {
      border-top: 1px solid #332626;
      padding-top: 18px;
      font-size: 10px;
      line-height: 1.7;
      color: #716765;
      text-align: center;
    }

    .alert-error,
    .alert-success {
      padding: 12px 14px;
      font-size: 12px;
      margin: 15px 0;
    }

    .alert-error {
      background: #361319;
      border: 1px solid #8f2938;
      color: #ffadb5;
    }

    .alert-success {
      background: #102a20;
      border: 1px solid #276a4a;
      color: #a6f2c9;
    }

    @media (max-width: 800px) {
      .auth-shell {
        grid-template-columns: 1fr;
      }

      .auth-visual {
        min-height: 360px;
        padding: 35px 24px;
      }

      .auth-visual h1 {
        font-size: 58px;
      }

      .auth-form-wrap {
        padding: 55px 24px;
      }
    }
  `]
})
export class AuthComponent {
  name = '';
  email = '';
  password = '';
  busy = false;
  error = '';
  success = '';
  isRegister = false;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router,
    route: ActivatedRoute
  ) {
    this.isRegister = this.router.url.startsWith('/register');

    route.url.subscribe(() => {
      this.isRegister = this.router.url.startsWith('/register');
      this.error = '';
      this.success = '';
    });
  }

  submit(): void {
    this.error = '';
    this.success = '';

    if (this.isRegister && this.password.length < 8) {
      this.error = 'Use a password with at least 8 characters.';
      return;
    }

    this.busy = true;

    const request = this.isRegister
      ? this.auth.register({
          name: this.name,
          email: this.email,
          password: this.password
        })
      : this.auth.login({
          email: this.email,
          password: this.password
        });

    request.subscribe({
      next: (data: any) => {
        this.auth.saveSession(data);
        this.busy = false;

        void this.router.navigateByUrl(
          data.user.role === 'ADMIN' ? '/admin' : '/dashboard'
        );
      },
      error: (e: any) => {
        this.busy = false;
        this.error =
          e?.error?.message ||
          'Unable to connect. Check that the FindIt API is running.';
      }
    });
  }
}
