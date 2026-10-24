import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, User } from './api.service';

@Injectable({providedIn:'root'})
export class AuthService {
  user = signal<User|null>(this.readUser());
  constructor(private api:ApiService, private router:Router) {}
  private readUser():User|null {
    try { return JSON.parse(localStorage.getItem('findit_user') || 'null'); } catch { return null; }
  }
  get isLoggedIn() { return !!this.user(); }
  get isAdmin() { return this.user()?.role === 'ADMIN'; }
  saveSession(data:any) {
    localStorage.setItem('findit_token', data.token);
    localStorage.setItem('findit_user', JSON.stringify(data.user));
    this.user.set(data.user as User);
  }
  login(data:{email:string;password:string}) {
    return this.api.login(data);
  }
  register(data:{name:string;email:string;password:string}) { return this.api.register(data); }
  logout() {
    localStorage.removeItem('findit_token'); localStorage.removeItem('findit_user');
    this.user.set(null); void this.router.navigateByUrl('/');
  }
}
