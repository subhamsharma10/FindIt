import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User { id: string; name: string; email: string; role: 'STUDENT' | 'ADMIN'; }
export interface Item {
  _id: string; title: string; description: string; type: 'LOST'|'FOUND'; category: string;
  location: string; dateOccurred: string; imageUrl?: string; status: string;
  owner?: { _id?: string; name?: string } | string; contactHint?: string;
}
export interface Claim { _id: string; item: Item; claimant?: User; message: string; status: string; createdAt: string; }
@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private base = 'http://localhost:3000/api';
  private token = () => localStorage.getItem('findit_token') || '';
  private headers = () => ({ Authorization: `Bearer ${this.token()}` });

  register(data: {name:string; email:string; password:string}): Observable<any> { return this.http.post(`${this.base}/auth/register`, data); }
  login(data: {email:string; password:string}): Observable<any> { return this.http.post(`${this.base}/auth/login`, data); }
  items(filters: {q?:string; type?:string; category?:string} = {}): Observable<{items:Item[]}> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([k,v]) => { if (v && v !== 'All') params = params.set(k,v); });
    return this.http.get<{items:Item[]}>(`${this.base}/items`, { params });
  }
  item(id:string): Observable<{item:Item}> { return this.http.get<{item:Item}>(`${this.base}/items/${id}`); }
  mine(): Observable<{items:Item[]}> { return this.http.get<{items:Item[]}>(`${this.base}/items/mine`, { headers:this.headers() }); }
  createItem(data:any): Observable<{item:Item}> { return this.http.post<{item:Item}>(`${this.base}/items`, data, { headers:this.headers() }); }
  archive(id:string): Observable<any> { return this.http.delete(`${this.base}/items/${id}`, { headers:this.headers() }); }
  createClaim(data:{itemId:string; message:string}): Observable<any> { return this.http.post(`${this.base}/claims`, data, { headers:this.headers() }); }
  myClaims(): Observable<{claims:Claim[]}> { return this.http.get<{claims:Claim[]}>(`${this.base}/claims/mine`, { headers:this.headers() }); }
  allClaims(): Observable<{claims:Claim[]}> { return this.http.get<{claims:Claim[]}>(`${this.base}/claims`, { headers:this.headers() }); }
  decideClaim(id:string,status:'APPROVED'|'REJECTED'): Observable<any> { return this.http.patch(`${this.base}/claims/${id}`, {status}, { headers:this.headers() }); }
  moderateItem(id:string,status:string): Observable<any> { return this.http.patch(`${this.base}/items/${id}/status`, {status}, { headers:this.headers() }); }
}
