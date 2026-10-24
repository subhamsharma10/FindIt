
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService, Item } from '../core/api.service';
import { AuthService } from '../core/auth.service';
import { DateTextPipe } from './date-text.pipe';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DateTextPipe],
  template: `
    @if (loading) {
      <div class="loading-state detail-loading">Opening report…</div>
    } @else if (error) {
      <section class="empty-state detail-loading">
        <h3>{{ error }}</h3>
        <a routerLink="/browse" class="button">Back to the board ↗</a>
      </section>
    } @else if (item) {
      <section class="detail-hero">
        <div class="section-kicker">
          THE COMMUNITY BOARD / ITEM {{ item.type }}
        </div>
        <a routerLink="/browse" class="underlined-link">
          ← Back to all reports
        </a>
      </section>

      <section class="detail-layout section-pad">
        <div class="detail-image">
          @if (item.imageUrl) {
            <img [src]="item.imageUrl" [alt]="item.title" />
          } @else {
            <div class="photo-placeholder">
              <span>{{ item.category }}</span>
              <strong>{{ item.type }}</strong>
              <p>Every detail brings it closer to home.</p>
            </div>
          }

          <span class="type-label" [class.found]="item.type === 'FOUND'">
            {{ item.type }}
          </span>
        </div>

        <article class="detail-info">
          <div class="item-category">
            {{ item.category }} <span>·</span> {{ item.location }}
          </div>

          <h1>{{ item.title }}</h1>
          <p class="detail-description">{{ item.description }}</p>

          <div class="detail-facts">
            <div>
              <span>REPORTED ON</span>
              <strong>{{ item.dateOccurred | dateText }}</strong>
            </div>

            <div>
              <span>REPORT STATUS</span>
              <strong class="status-text">
                {{ item.status.replace('_', ' ') }}
              </strong>
            </div>

            <div>
              <span>REPORTED BY</span>
              <strong>{{ ownerName }}</strong>
            </div>
          </div>

          @if (item.contactHint) {
            <div class="contact-hint">
              <span>CONTACT HINT</span>
              <p>{{ item.contactHint }}</p>
            </div>
          }

          @if (auth.user() && ownerId === auth.user()?.id) {
            <div class="notice-box">
              This is your report. You can manage it from
              <a routerLink="/dashboard">My activity</a>.
            </div>
          } @else if (
            item.status === 'RESOLVED' ||
            item.status === 'ARCHIVED'
          ) {
            <div class="notice-box">
              This report is no longer accepting claims.
            </div>
          } @else if (!auth.user()) {
            <a class="button detail-claim" routerLink="/login">
              Sign in to make a claim ↗
            </a>
          } @else {
            <form class="claim-form" (ngSubmit)="claim()">
              <div class="section-kicker">THINK THIS IS YOURS?</div>
              <h2>Tell us why.</h2>
              <p>
                Describe a detail that can help the reporter or admin
                verify your claim.
              </p>

              <label class="form-field">
                Your claim message
                <textarea
                  class="field-textarea"
                  name="message"
                  [(ngModel)]="message"
                  required
                  minlength="10"
                  maxlength="1000"
                  rows="4"
                  placeholder="I believe this item is mine because…"
                ></textarea>
              </label>

              @if (claimError) {
                <div class="alert-error" role="alert">
                  {{ claimError }}
                </div>
              }

              @if (claimSuccess) {
                <div class="alert-success" role="status">
                  {{ claimSuccess }}
                </div>
              }

              <button
                class="button detail-claim"
                type="submit"
                [disabled]="claimBusy"
              >
                {{ claimBusy ? 'Sending…' : 'Submit claim ↗' }}
              </button>
            </form>
          }
        </article>
      </section>
    }
  `,
  styles: [`
    .detail-hero {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      padding: 32px max(48px, calc((100% - 1180px) / 2));
      background: #100b0b;
      border-bottom: 1px solid #332525;
    }

    .detail-layout {
      display: grid;
      grid-template-columns: 1.05fr .95fr;
      gap: 65px;
      align-items: start;
    }

    .detail-image {
      height: 540px;
      position: relative;
      background: #1a1010;
      border: 1px solid #392727;
    }

    .detail-image > img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: saturate(.75);
    }

    .detail-image .photo-placeholder {
      padding: 35px;
    }

    .detail-image .photo-placeholder strong {
      font-size: clamp(60px, 8vw, 105px);
    }

    .detail-image .photo-placeholder p {
      color: #b8a8a6;
      max-width: 230px;
      line-height: 1.7;
    }

    .detail-info {
      padding-top: 10px;
    }

    .detail-info h1 {
      font-family: var(--serif);
      font-size: clamp(48px, 6vw, 76px);
      line-height: 1.02;
      letter-spacing: -.04em;
      font-weight: 500;
      margin: 20px 0 25px;
    }

    .detail-description {
      font-size: 14px;
      line-height: 1.9;
      color: #c1b5b2;
      white-space: pre-wrap;
    }

    .detail-facts {
      border-top: 1px solid #382828;
      border-bottom: 1px solid #382828;
      margin: 30px 0;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      padding: 22px 0;
    }

    .detail-facts div {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .detail-facts span,
    .contact-hint > span {
      font-size: 9px;
      letter-spacing: .16em;
      color: #8c7c79;
    }

    .detail-facts strong {
      font-size: 13px;
      font-weight: 500;
      color: #eee;
    }

    .status-text {
      color: #ff6675 !important;
    }

    .contact-hint {
      padding: 18px;
      background: #160e0e;
      border-left: 2px solid var(--red);
    }

    .contact-hint p {
      font-size: 12px;
      color: #c4b7b4;
      line-height: 1.7;
      margin-bottom: 0;
    }

    .claim-form {
      margin-top: 35px;
      border-top: 1px solid #382828;
      padding-top: 28px;
    }

    .claim-form h2 {
      font-size: 37px;
      margin: 16px 0;
    }

    .claim-form > p {
      font-size: 12px;
      color: #a99e9b;
      line-height: 1.7;
    }

    .detail-claim {
      width: 100%;
      margin-top: 8px;
    }

    .notice-box {
      margin-top: 25px;
      padding: 16px;
      border: 1px solid #493031;
      color: #c9b9b6;
      font-size: 12px;
      line-height: 1.7;
    }

    .notice-box a {
      color: #ff6474;
      text-decoration: underline;
    }

    .detail-loading {
      margin: 60px auto;
      max-width: 900px;
    }

    @media (max-width: 850px) {
      .detail-hero {
        padding: 25px 22px;
        align-items: start;
        flex-direction: column;
      }

      .detail-layout {
        grid-template-columns: 1fr;
        gap: 35px;
        padding: 35px 22px 70px;
      }

      .detail-image {
        height: 380px;
      }
    }
  `]
})
export class ItemDetailComponent {
  item: Item | null = null;
  loading = true;
  error = '';
  message = '';
  claimBusy = false;
  claimError = '';
  claimSuccess = '';

  constructor(
    route: ActivatedRoute,
    private api: ApiService,
    public auth: AuthService
  ) {
    route.paramMap.subscribe(params => {
      const id = params.get('id');

      if (!id) {
        this.error = 'Item not found.';
        this.loading = false;
        return;
      }

      this.loading = true;
      this.error = '';

      this.api.item(id).subscribe({
        next: response => {
          this.item = response.item;
          this.loading = false;
        },
        error: error => {
          this.error =
            error?.error?.message || 'This report could not be found.';
          this.loading = false;
        }
      });
    });
  }

  get ownerName(): string {
    const owner = this.item?.owner;

    return typeof owner === 'object'
      ? owner?.name || 'Campus member'
      : 'Campus member';
  }

  get ownerId(): string {
    const owner = this.item?.owner;

    return typeof owner === 'object'
      ? owner?._id || ''
      : owner || '';
  }

  claim(): void {
    if (!this.item) {
      return;
    }

    this.claimError = '';
    this.claimSuccess = '';
    this.claimBusy = true;

    this.api.createClaim({
      itemId: this.item._id,
      message: this.message
    }).subscribe({
      next: () => {
        this.claimBusy = false;
        this.claimSuccess = 'Your claim has been sent for review.';
        this.message = '';
      },
      error: error => {
        this.claimBusy = false;
        this.claimError = error?.error?.message || 'Unable to send claim.';
      }
    });
  }
}
