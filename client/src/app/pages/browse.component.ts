import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService, Item } from '../core/api.service';
import { DateTextPipe } from './date-text.pipe';

@Component({
 standalone:true,imports:[CommonModule,FormsModule,RouterLink,DateTextPipe],
 template:`
 <section class="page-hero"><div class="section-kicker">01 — THE COMMUNITY BOARD</div><h1>Find what<br>you've <em>lost.</em></h1><p>Browse the things your campus community has found, lost, and is hoping to reunite.</p></section>
 <section class="board-section section-pad">
   <div class="filters">
     <label class="search-field"><span>⌕</span><input [(ngModel)]="q" (ngModelChange)="load()" placeholder="Search items, places, details…" aria-label="Search items"></label>
     <select [(ngModel)]="type" (ngModelChange)="load()" aria-label="Filter by report type"><option value="">All reports</option><option value="LOST">Lost items</option><option value="FOUND">Found items</option></select>
     <select [(ngModel)]="category" (ngModelChange)="load()" aria-label="Filter by category"><option>All</option>@for(c of categories;track c){<option [value]="c">{{c}}</option>}</select>
     <a class="button button-small" routerLink="/report">＋ Report item</a>
   </div>
   @if(error){<div class="alert-error">{{error}}</div>}
   @if(loading){<div class="loading-state">Searching the board…</div>}
   @else if(items.length){<div class="results-caption"><span>{{items.length}} {{items.length===1?'REPORT':'REPORTS'}} FOUND</span><span>NEWEST FIRST</span></div><div class="item-grid">
     @for(item of items;track item._id){<a class="item-card" [routerLink]="['/item',item._id]"><div class="item-photo">
       @if(item.imageUrl){<img [src]="item.imageUrl" [alt]="item.title" loading="lazy"/>} @else{<div class="photo-placeholder"><span>{{item.category}}</span><strong>{{item.type}}</strong></div>}
       <span class="type-label" [class.found]="item.type==='FOUND'">{{item.type}}</span></div>
       <div class="item-card-info"><div class="item-category">{{item.category}} <span>·</span> {{item.location}}</div><h3>{{item.title}}</h3><div class="item-card-foot"><span>{{item.dateOccurred|dateText}}</span><span class="circle-arrow">↗</span></div></div></a>}
   </div>} @else{<div class="empty-state"><span class="empty-symbol">✳</span><h3>No matching reports.</h3><p>Try another search or be the first to report it.</p><a class="button" routerLink="/report">Report an item ↗</a></div>}
 </section>`,
 styles:[`
 .page-hero{padding:80px max(48px,calc((100% - 1180px)/2)) 65px;background:radial-gradient(ellipse at 78% 30%,#6d111a22,transparent 50%),#100b0b;border-bottom:1px solid #302222}.page-hero h1{font-size:clamp(65px,9vw,118px);margin:26px 0}.page-hero p{max-width:510px;color:#b7aaa7;line-height:1.8}.board-section{padding-top:45px;padding-bottom:100px}.filters{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:30px}.search-field{display:flex;align-items:center;gap:12px;flex:1;min-width:240px;background:#140d0d;border:1px solid #382626;padding:0 14px}.search-field span{font-size:25px;color:var(--red)}.search-field input{background:transparent;border:0;outline:0;color:#fff;width:100%;padding:14px 0;font:inherit;font-size:12px}.filters select{background:#140d0d;border:1px solid #382626;color:#ddd;padding:14px;min-width:140px;font:inherit;font-size:12px}.results-caption{display:flex;justify-content:space-between;color:#817573;font-size:10px;letter-spacing:.16em;border-bottom:1px solid #332525;padding:14px 0;margin-bottom:24px}
 @media(max-width:800px){.page-hero{padding:60px 22px 45px}.board-section{padding:35px 22px 70px}.filters>*{width:100%}.search-field{flex:auto}.filters select{width:100%}}
 `]
})
export class BrowseComponent {
 q='';type='';category='All';items:Item[]=[];loading=true;error='';
 categories=['Electronics','ID & Cards','Bags','Keys','Clothing','Books','Accessories','Other'];
 private timer:any;
 constructor(private api:ApiService){this.load();}
 load(){this.loading=true;this.error='';clearTimeout(this.timer);this.timer=setTimeout(()=>this.api.items({q:this.q,type:this.type,category:this.category}).subscribe({next:r=>{this.items=r.items;this.loading=false;},error:e=>{this.error=e?.error?.message||'Could not load reports.';this.loading=false;}}),180);}
}
