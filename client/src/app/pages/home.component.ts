import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService, Item } from '../core/api.service';
import { DateTextPipe } from './date-text.pipe';

@Component({
 standalone:true, imports:[RouterLink,DateTextPipe],
 template:`
 <section class="hero">
   <div class="hero-image"></div><div class="hero-shade"></div>
   <div class="hero-content">
     <p class="eyebrow"><span class="eyebrow-line"></span> YOUR CAMPUS. YOUR COMMUNITY.</p>
     <h1>Lost things.<br><em>Found stories.</em></h1>
     <p class="hero-copy">A place for misplaced essentials to find their way home. Search campus finds, report what you've lost, and help someone get back what matters.</p>
     <div class="hero-actions"><a class="button" routerLink="/browse">Explore the board <span>↗</span></a><a class="button button-outline" routerLink="/report">Report an item <span>＋</span></a></div>
     <div class="hero-note"><span class="pulse-dot"></span> A little kindness goes a long way.</div>
   </div>
   <div class="hero-index"><span>01 / 04</span><span>THE CAMPUS LOST & FOUND</span></div>
 </section>
 <section class="intro-section section-pad">
   <div class="section-kicker">01 — A BETTER WAY TO FIND</div>
   <div class="intro-grid"><h2>Every item has<br>a way <em>back.</em></h2><div class="intro-copy"><p>From a set of keys left in the library to a notebook found outside the lab, FindIt brings the campus together around the things that go missing.</p><p>Simple reports. Helpful people. One shared place to reconnect students with their belongings.</p><a class="underlined-link" routerLink="/browse">How it works <span>↗</span></a></div></div>
   <div class="feature-strip">
     <article><span class="feature-number">01</span><div><h3>Report it</h3><p>Share what you lost or found with a few clear details.</p></div></article>
     <article><span class="feature-number">02</span><div><h3>Find the match</h3><p>Search by category, place, or a detail you remember.</p></div></article>
     <article><span class="feature-number">03</span><div><h3>Bring it home</h3><p>Send a claim request and let the right person reconnect.</p></div></article>
   </div>
 </section>
 <section class="spotlight section-pad">
   <div class="section-head"><div><div class="section-kicker">02 — THE COMMUNITY BOARD</div><h2>Recently <em>reported.</em></h2></div><a class="underlined-link" routerLink="/browse">View all items ↗</a></div>
   @if (loading) { <div class="loading-state">Gathering the latest reports…</div> }
   @else if (items.length) {
     <div class="item-grid">
       @for (item of items; track item._id) {
         <a class="item-card" [routerLink]="['/item',item._id]">
           <div class="item-photo" [class.no-photo]="!item.imageUrl">
             @if (item.imageUrl) { <img [src]="item.imageUrl" [alt]="item.title" loading="lazy"> }
             @else { <div class="photo-placeholder"><span>{{item.category}}</span><strong>{{item.type==='LOST'?'LOST':'FOUND'}}</strong></div> }
             <span class="type-label" [class.found]="item.type==='FOUND'">{{item.type}}</span>
           </div>
           <div class="item-card-info"><div class="item-category">{{item.category}} <span>·</span> {{item.location}}</div><h3>{{item.title}}</h3><div class="item-card-foot"><span>{{item.dateOccurred | dateText}}</span><span class="circle-arrow">↗</span></div></div>
         </a>
       }
     </div>
   } @else { <div class="empty-state"><span class="empty-symbol">✳</span><h3>The board is waiting.</h3><p>No reports yet. Be the first to add one.</p><a class="button" routerLink="/report">Make a report ↗</a></div> }
 </section>
 <section class="closing-banner"><div class="closing-glow"></div><div class="section-kicker">03 — MAKE A DIFFERENCE</div><h2>One small report.<br><em>A big relief.</em></h2><p>Something missing from your day? Let's help you find it.</p><a class="button button-light" routerLink="/report">Start a report <span>↗</span></a></section>
 `,
 styles:[`
 .hero{min-height:660px;height:min(780px,calc(100vh - 80px));position:relative;display:flex;align-items:center;overflow:hidden;background:#0b0808}
 .hero-image{position:absolute;inset:0;background-image:url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=2200&q=85');background-position:center 48%;background-size:cover;filter:saturate(.62);opacity:.48;transform:scale(1.02)}
 .hero-shade{position:absolute;inset:0;background:linear-gradient(90deg,rgba(9,6,6,.97) 0%,rgba(9,6,6,.78) 48%,rgba(9,6,6,.18) 100%),linear-gradient(0deg,#0b0808 0%,transparent 22%,rgba(0,0,0,.1) 75%,#0b0808 100%)}
 .hero-content{position:relative;z-index:1;width:min(1180px,calc(100% - 96px));margin:0 auto;padding:70px 0 86px}
 .eyebrow,.section-kicker{font-size:11px;letter-spacing:.22em;font-weight:700;color:#d2c8c5}
 .eyebrow{display:flex;align-items:center;gap:13px}.eyebrow-line{width:36px;height:1px;background:var(--red)}
 h1{font-size:clamp(68px,9.2vw,138px);line-height:.91;letter-spacing:-.065em;margin:32px 0 30px;max-width:940px;font-weight:500}
 h1 em,h2 em{font-family:var(--serif);font-weight:500;color:var(--red);font-style:normal;text-shadow:0 0 10px #ff142b,0 0 35px #d3001945}
 .hero-copy{max-width:490px;color:#d0c7c5;font-size:16px;line-height:1.8}
 .hero-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:30px}.hero-note{display:flex;align-items:center;gap:9px;margin-top:40px;color:#9f9592;font-size:12px}
 .pulse-dot{width:7px;height:7px;border-radius:50%;background:var(--red);box-shadow:0 0 12px var(--red)}
 .hero-index{position:absolute;z-index:1;bottom:27px;left:48px;right:48px;display:flex;justify-content:space-between;color:#817775;font-size:10px;letter-spacing:.14em}
 .section-pad{padding:112px max(48px,calc((100% - 1180px)/2))}
 .intro-section{background:#100b0b}.intro-grid{display:grid;grid-template-columns:1.1fr .8fr;gap:80px;margin:34px 0 70px;align-items:center}
 h2{font-size:clamp(48px,6.4vw,86px);line-height:.99;letter-spacing:-.055em;font-weight:500;margin:0}
 .intro-copy p,.closing-banner p{font-size:15px;color:#bdb2af;line-height:1.85;margin:0 0 16px}
 .feature-strip{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid #392b2b;border-bottom:1px solid #392b2b}
 .feature-strip article{display:flex;gap:20px;padding:30px 25px 30px 0;border-right:1px solid #392b2b}.feature-strip article+article{padding-left:28px}.feature-strip article:last-child{border:0}
 .feature-number{color:var(--red);font-family:var(--serif);font-size:25px}.feature-strip h3{font-size:18px;font-weight:500;margin:2px 0 10px}.feature-strip p{color:#a99e9b;font-size:13px;line-height:1.65;margin:0;max-width:240px}
 .spotlight{background:#0b0808}.section-head{display:flex;align-items:end;justify-content:space-between;gap:24px;margin-bottom:42px}.section-head h2{margin-top:18px}
 .item-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px}
 .item-card{display:block;border:1px solid #302323;background:#120d0d;transition:transform .25s,border-color .25s}.item-card:hover{transform:translateY(-5px);border-color:#7d2029}
 .item-photo{height:250px;position:relative;overflow:hidden;background:#201414}.item-photo img{width:100%;height:100%;object-fit:cover;filter:saturate(.72);transition:transform .5s}.item-card:hover img{transform:scale(1.04)}
 .type-label{position:absolute;top:15px;left:15px;background:#e3182b;color:white;padding:7px 10px;font-size:9px;letter-spacing:.14em;font-weight:700}.type-label.found{background:#f0e7df;color:#191010}
 .photo-placeholder{height:100%;display:flex;flex-direction:column;justify-content:space-between;padding:20px;background:radial-gradient(circle at 80% 20%,#542027,transparent 45%),linear-gradient(140deg,#251717,#0c0808)}.photo-placeholder span{font-size:11px;letter-spacing:.15em;color:#baaaa7;text-transform:uppercase}.photo-placeholder strong{font-family:var(--serif);font-size:44px;color:#ff243b;text-shadow:0 0 20px #ff142b7a;font-weight:500}
 .item-card-info{padding:20px}.item-category{font-size:10px;text-transform:uppercase;letter-spacing:.12em;color:#a99b98}.item-category span{color:var(--red);padding:0 5px}.item-card h3{font-size:23px;font-weight:500;margin:12px 0 23px}.item-card-foot{display:flex;justify-content:space-between;align-items:center;border-top:1px solid #332626;padding-top:14px;color:#918582;font-size:11px}.circle-arrow{display:grid;place-items:center;width:28px;height:28px;border:1px solid #543038;border-radius:50%;color:#ff5a68}
 .loading-state,.empty-state{padding:70px 20px;text-align:center;color:#aa9e9b;border:1px solid #342727}.empty-symbol{font-size:34px;color:var(--red)}.empty-state h3{font-family:var(--serif);font-size:35px;font-weight:500;color:#fff}.empty-state p{color:#a99e9b;margin-bottom:24px}
 .closing-banner{position:relative;overflow:hidden;text-align:center;padding:110px 24px 120px;background:#17090b}.closing-glow{position:absolute;inset:0;background:radial-gradient(ellipse at center,#8b101d36,transparent 65%);pointer-events:none}.closing-banner>*:not(.closing-glow){position:relative}.closing-banner h2{font-size:clamp(58px,8vw,104px);margin:27px 0}.closing-banner p{margin:0 auto 26px;max-width:440px}
 @media(max-width:800px){.hero-content{width:calc(100% - 44px)}.hero{min-height:650px;height:auto}.hero-index{left:22px;right:22px}.section-pad{padding:76px 22px}.intro-grid{grid-template-columns:1fr;gap:28px}.feature-strip{grid-template-columns:1fr}.feature-strip article,.feature-strip article+article{padding:22px 0;border-right:0;border-bottom:1px solid #392b2b}.item-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.item-photo{height:210px}.section-head{align-items:start;flex-direction:column}}
 @media(max-width:520px){h1{font-size:66px}.hero-actions .button{width:100%;justify-content:center}.item-grid{grid-template-columns:1fr}.item-photo{height:245px}.section-head h2{font-size:54px}}
 `]
})
export class HomeComponent {
 items:Item[]=[]; loading=true;
 constructor(api:ApiService) { api.items().subscribe({next:r=>{this.items=r.items.slice(0,3);this.loading=false},error:()=>this.loading=false}); }
}
