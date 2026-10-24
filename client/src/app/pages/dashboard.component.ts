import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService, Item, Claim } from '../core/api.service';
import { AuthService } from '../core/auth.service';
import { DateTextPipe } from './date-text.pipe';

@Component({
 standalone:true,imports:[CommonModule,RouterLink,DateTextPipe],
 template:`
 <section class="page-hero dashboard-hero"><div class="section-kicker">YOUR FINDIT SPACE</div><h1>Your activity.<br>Your <em>community.</em></h1><p>Keep track of what you've reported and the claims you've sent.</p></section>
 <section class="section-pad dashboard-content">
   @if(error){<div class="alert-error">{{error}}</div>}
   <div class="dashboard-welcome"><div><div class="section-kicker">YOUR OVERVIEW</div><h2>Hello, <em>{{auth.user()?.name?.split(' ')?.[0]}}</em>.</h2></div><a routerLink="/report" class="button">＋ New report</a></div>
   <div class="stat-grid"><article><span>YOUR REPORTS</span><strong>{{items.length}}</strong><small>Items you've shared</small></article><article><span>CLAIMS SENT</span><strong>{{claims.length}}</strong><small>Requests you've made</small></article><article><span>OPEN REPORTS</span><strong>{{items.filter(open).length}}</strong><small>Still looking for a match</small></article></div>
   <div class="dashboard-section-head"><h2>Your <em>reports.</em></h2><a routerLink="/browse" class="underlined-link">Explore board ↗</a></div>
   @if(loading){<div class="loading-state">Loading your activity…</div>}
   @else if(items.length){<div class="dashboard-list">@for(item of items;track item._id){<article class="dashboard-row"><div class="mini-thumb">@if(item.imageUrl){<img [src]="item.imageUrl" [alt]="item.title">}@else{<span>{{item.type}}</span>}</div><div class="row-main"><span class="item-category">{{item.category}} · {{item.location}}</span><h3>{{item.title}}</h3><span class="row-date">{{item.dateOccurred|dateText}}</span></div><span class="status-pill" [class.status-found]="item.type==='FOUND'">{{item.status.replace('_',' ')}}</span><a class="circle-arrow" [routerLink]="['/item',item._id]">↗</a><button class="archive-button" (click)="archive(item)" [disabled]="item.status==='ARCHIVED'">Archive</button></article>}</div>}
   @else{<div class="empty-state"><h3>No reports yet.</h3><p>Your reports will show up here.</p><a class="button" routerLink="/report">Create your first report ↗</a></div>}
   <div class="dashboard-section-head claim-heading"><h2>Claims <em>sent.</em></h2></div>
   @if(!claims.length){<p class="muted-copy">Claims you submit on item pages will appear here.</p>}@else{<div class="dashboard-list">@for(claim of claims;track claim._id){<article class="dashboard-row"><div class="mini-thumb"><span>CLAIM</span></div><div class="row-main"><span class="item-category">{{claim.item?.category}} · {{claim.item?.location}}</span><h3>{{claim.item?.title}}</h3><span class="row-date">{{claim.message}}</span></div><span class="status-pill">{{claim.status}}</span></article>}</div>}
 </section>`,
 styles:[`
 .dashboard-hero{background:radial-gradient(ellipse at 80% 10%,#76121c2c,transparent 48%),#100b0b}.dashboard-content{padding-top:50px}.dashboard-welcome{display:flex;align-items:end;justify-content:space-between;gap:20px;margin-bottom:30px}.dashboard-welcome h2{font-size:48px;margin-top:16px}.stat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:15px;margin-bottom:60px}.stat-grid article{padding:25px;border:1px solid #382727;background:#100b0b;display:flex;flex-direction:column;gap:10px}.stat-grid article>span{font-size:9px;letter-spacing:.15em;color:#a29390}.stat-grid strong{font-family:var(--serif);font-size:52px;font-weight:500;color:#ff3045}.stat-grid small{font-size:11px;color:#918380}.dashboard-section-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:22px}.dashboard-section-head h2{font-size:42px}.dashboard-list{border-top:1px solid #382727}.dashboard-row{display:flex;align-items:center;gap:18px;padding:18px 0;border-bottom:1px solid #382727}.mini-thumb{width:68px;height:68px;flex:none;background:#251416;display:grid;place-items:center;color:#ff5a6a;font-size:9px;letter-spacing:.1em}.mini-thumb img{width:100%;height:100%;object-fit:cover}.row-main{flex:1;min-width:0}.row-main h3{font-size:17px;font-weight:500;margin:6px 0}.row-date{font-size:11px;color:#8f817e;display:block;max-width:500px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.status-pill{font-size:9px;letter-spacing:.08em;padding:7px 9px;border:1px solid #59313a;color:#ff8b97;white-space:nowrap}.status-found{border-color:#524439;color:#e4c8a5}.archive-button{background:transparent;color:#8f817e;border:0;cursor:pointer;font:inherit;font-size:11px}.claim-heading{margin-top:65px}.muted-copy{color:#968986;font-size:13px}
 @media(max-width:700px){.dashboard-content{padding:35px 22px 70px}.dashboard-welcome{align-items:start;flex-direction:column}.stat-grid{grid-template-columns:1fr}.dashboard-row{gap:10px;flex-wrap:wrap}.row-main{width:calc(100% - 100px);flex:auto}.status-pill{margin-left:78px}.dashboard-row .circle-arrow{margin-left:auto}.dashboard-section-head h2{font-size:35px}}
 `]
})
export class DashboardComponent {
 items:Item[]=[];claims:Claim[]=[];loading=true;error='';
 constructor(private api:ApiService,public auth:AuthService){this.load();}
 open(item:Item){return item.status==='OPEN'||item.status==='CLAIM_PENDING';}
 load(){this.api.mine().subscribe({next:r=>{this.items=r.items;this.loading=false;},error:e=>{this.error=e?.error?.message||'Could not load your reports.';this.loading=false;}});this.api.myClaims().subscribe({next:r=>this.claims=r.claims,error:()=>{} });}
 archive(item:Item){if(!confirm(`Archive "${item.title}"?`))return;this.api.archive(item._id).subscribe({next:()=>this.items=this.items.filter(i=>i._id!==item._id),error:e=>this.error=e?.error?.message||'Unable to archive report.'});}
}
