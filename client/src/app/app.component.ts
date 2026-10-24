import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth.service';

@Component({
 selector:'app-root', standalone:true, imports:[RouterLink,RouterLinkActive,RouterOutlet],
 template:`
 <header class="site-header">
   <a class="brand" routerLink="/" aria-label="FindIt home"><span class="brand-mark">F</span><span>Find<span class="red">I</span>t<span class="brand-dot">.</span><small>CAMPUS LOST & FOUND</small></span></a>
   <nav class="desktop-nav">
     <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Home</a>
     <a routerLink="/browse" routerLinkActive="active">Explore items</a>
     <a routerLink="/report" routerLinkActive="active">Report an item</a>
     @if (auth.user()) { <a routerLink="/dashboard" routerLinkActive="active">My activity</a> }
     @if (auth.isAdmin) { <a routerLink="/admin" routerLinkActive="active">Admin</a> }
   </nav>
   <div class="header-actions">
     @if (auth.user(); as user) {
       <span class="user-chip">{{user.name}}</span><button class="text-button" (click)="auth.logout()">Sign out</button>
     } @else {
       <a class="login-link" routerLink="/login">Sign in</a><a class="button button-small" routerLink="/register">Join FindIt <span>↗</span></a>
     }
   </div>
 </header>
 <main><router-outlet /></main>
 <footer class="site-footer">
   <div class="footer-top"><a class="brand" routerLink="/"><span class="brand-mark">F</span><span>Find<span class="red">I</span>t<span class="brand-dot">.</span><small>CAMPUS LOST & FOUND</small></span></a><p>Lost something? Found something? <span class="red">Bring it back together.</span></p><a routerLink="/browse" class="footer-link">Explore the board ↗</a></div>
   <div class="footer-bottom"><span>© {{year}} FindIt Campus Community</span><span>Built for a campus that looks out for each other.</span></div>
 </footer>`
})
export class AppComponent {
 year = new Date().getFullYear();
 constructor(public auth:AuthService) {}
}
