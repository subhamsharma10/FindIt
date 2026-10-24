import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService, Item, Claim } from '../core/api.service';
import { AuthService } from '../core/auth.service';

@Component({
 standalone:true,imports:[CommonModule,RouterLink],
 template:`
 <section class="page-hero"><div class="section-kicker">FINDIT / ADMINISTRATION</div><h1>Keep the board<br><em>in good hands.</em></h1><p>Review claims and maintain a useful, respectful campus community board.</p></section>
 <section class="section-pad admin-content">
   @if(!auth.isAdmin){<div class="alert-error">Administrator access is required to view this page.</div><a routerLink="/login" class="button">Sign in ↗</a>}
   @else{
     @if(error){<div class="alert-error">{{error}}</div>}
     <div class="stat-grid"><article><span>ACTIVE REPORTS</span><strong>{{items.length}}</strong><small>Visible items on the board</small></article><article><span>PENDING CLAIMS</span><strong>{{claims.filter(pending).length}}</strong><small>Awaiting a decision</small></article><article><span>RESOLVED ITEMS</span><strong>{{items.filter(resolved).length}}</strong><small>Successfully reconnected</small></article></div>
     <div class="dashboard-section-head"><h2>Claim <em>review.</em></h2><span class="section-kicker">REVIEW EACH REQUEST</span></div>
     @if(loading){<div class="loading-state">Loading moderation queue…</div>}
     @else if(claims.length){<div class="dashboard-list">@for(claim of claims;track claim._id){<article class="admin-row"><div class="row-main"><span class="item-category">{{claim.item?.type}} · {{claim.item?.category}}</span><h3>{{claim.item?.title}}</h3><p>{{claim.message}}</p><span class="row-date">Claimant: {{claim.claimant?.name}} · {{claim.claimant?.email}}</span></div><span class="status-pill">{{claim.status}}</span>@if(claim.status==='PENDING'){<button class="button button-small" (click)="decide(claim,'APPROVED')">Approve</button><button class="button button-small button-outline" (click)="decide(claim,'REJECTED')">Reject</button>}</article>}</div>}
     @else{<div class="empty-state"><h3>All caught up.</h3><p>No claim requests to review.</p></div>}
     <div class="dashboard-section-head item-review-head"><h2>Item <em>moderation.</em></h2></div>
     <div class="dashboard-list">@for(item of items;track item._id){<article class="dashboard-row"><div class="mini-thumb">@if(item.imageUrl){<img [src]="item.imageUrl" [alt]="item.title">}@else{<span>{{item.type}}</span>}</div><div class="row-main"><span class="item-category">{{item.type}} · {{item.category}}</span><h3>{{item.title}}</h3><span class="row-date">{{item.location}}</span></div><select class="field-select status-select" [value]="item.status" (change)="moderate(item,$any($event.target).value)"><option>OPEN</option><option>CLAIM_PENDING</option><option>RESOLVED</option><option>ARCHIVED</option></select><a class="circle-arrow" [routerLink]="['/item',item._id]">↗</a></article>}</div>
   }
 </section>`,
 styles:[`
 .admin-content{padding-top:50px}.stat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:15px;margin-bottom:60px}.stat-grid article{padding:25px;border:1px solid #382727;background:#100b0b;display:flex;flex-direction:column;gap:10px}.stat-grid article>span{font-size:9px;letter-spacing:.15em;color:#a29390}.stat-grid strong{font-family:var(--serif);font-size:52px;font-weight:500;color:#ff3045}.stat-grid small{font-size:11px;color:#918380}.dashboard-section-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:22px;margin-top:40px}.dashboard-section-head h2{font-size:42px}.dashboard-list{border-top:1px solid #382727}.admin-row{display:flex;align-items:center;gap:15px;padding:22px 0;border-bottom:1px solid #382727}.admin-row .row-main{flex:1}.admin-row h3{font-size:18px;font-weight:500;margin:7px 0}.admin-row p{font-size:12px;line-height:1.7;color:#b9aaa7}.admin-row .button{flex:none}.status-select{width:160px}.item-review-head{margin-top:70px}
 @media(max-width:700px){.admin-content{padding:35px 22px 70px}.stat-grid{grid-template-columns:1fr}.admin-row{align-items:start;flex-wrap:wrap}.admin-row .row-main{flex-basis:100%}.status-select{flex:1}.dashboard-section-head h2{font-size:34px}}
 `]
})
export class AdminComponent {
 items:Item[]=[];claims:Claim[]=[];loading=true;error='';
 constructor(private api:ApiService,public auth:AuthService){if(auth.isAdmin)this.load();}
 pending(c:Claim){return c.status==='PENDING';}
 resolved(i:Item){return i.status==='RESOLVED';}
 load(){this.loading=true;this.api.items().subscribe({next:r=>{this.items=r.items;this.loading=false;},error:e=>{this.error=e?.error?.message||'Unable to load items.';this.loading=false;}});this.api.allClaims().subscribe({next:r=>this.claims=r.claims,error:e=>this.error=e?.error?.message||'Unable to load claims.'});}
 decide(claim:Claim,status:'APPROVED'|'REJECTED'){this.api.decideClaim(claim._id,status).subscribe({next:r=>{this.claims=this.claims.map(c=>c._id===claim._id?{...c,status:r.claim.status}:c);this.load();},error:e=>this.error=e?.error?.message||'Could not update claim.'});}
 moderate(item:Item,status:string){this.api.moderateItem(item._id,status).subscribe({next:r=>this.items=this.items.map(i=>i._id===item._id?r.item:i),error:e=>this.error=e?.error?.message||'Could not update item.'});}
}
