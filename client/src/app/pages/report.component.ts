import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../core/api.service';
import { AuthService } from '../core/auth.service';

@Component({
 standalone:true,imports:[CommonModule,FormsModule,RouterLink],
 template:`
 <section class="page-hero"><div class="section-kicker">02 — ADD TO THE BOARD</div><h1>Help it find<br>its <em>way home.</em></h1><p>Every useful detail makes a difference. Tell the community what happened.</p></section>
 <section class="report-layout section-pad">
   <aside class="report-aside"><span class="aside-number">01 / REPORT</span><h2>A few details.<br>A <em>real difference.</em></h2><p>Share only information you're comfortable making visible to other signed-in campus members. Keep unique proof details for the claim process.</p><div class="aside-note"><span>✳</span><p>Never post passwords, financial details, or sensitive identity information.</p></div></aside>
   <form class="report-form" (ngSubmit)="submit()">
     <div class="form-heading"><div class="section-kicker">ITEM DETAILS</div><span>* REQUIRED</span></div>
     <div class="type-picker"><button type="button" [class.selected]="form.type==='LOST'" (click)="form.type='LOST'"><span>↘</span><strong>I lost something</strong><small>Help me find it</small></button><button type="button" [class.selected]="form.type==='FOUND'" (click)="form.type='FOUND'"><span>↗</span><strong>I found something</strong><small>Help it find its owner</small></button></div>
     <label class="form-field">Item name *<input class="field-input" name="title" [(ngModel)]="form.title" required minlength="3" maxlength="120" placeholder="e.g. Black wireless headphones"></label>
     <div class="form-row"><label class="form-field">Category *<select class="field-select" name="category" [(ngModel)]="form.category"><option>Electronics</option><option>ID & Cards</option><option>Bags</option><option>Keys</option><option>Clothing</option><option>Books</option><option>Accessories</option><option>Other</option></select></label><label class="form-field">Date *<input class="field-input" type="date" name="dateOccurred" [(ngModel)]="form.dateOccurred" required [max]="today"></label></div>
     <label class="form-field">Where did it happen? *<input class="field-input" name="location" [(ngModel)]="form.location" required minlength="2" placeholder="e.g. Library, second floor"></label>
     <label class="form-field">Description *<textarea class="field-textarea" name="description" [(ngModel)]="form.description" required minlength="10" maxlength="2000" rows="5" placeholder="Colour, brand, distinctive features, or anything that could help identify it."></textarea><small class="field-help">{{form.description.length}} / 2000 characters</small></label>
     <label class="form-field">Photo URL <span class="optional">(optional)</span><input class="field-input" type="url" name="imageUrl" [(ngModel)]="form.imageUrl" placeholder="https://…"><small class="field-help">Use a publicly accessible image URL for now.</small></label>
     <label class="form-field">Contact hint <span class="optional">(optional)</span><input class="field-input" name="contactHint" [(ngModel)]="form.contactHint" maxlength="160" placeholder="e.g. Message me through campus email"></label>
     @if(error){<div class="alert-error">{{error}}</div>}
     <button class="button submit-report" [disabled]="busy">{{busy?'Publishing…':'Publish report ↗'}}</button><p class="privacy-note">By publishing, you confirm this report is accurate and appropriate for the campus community.</p>
   </form>
 </section>`,
 styles:[`
 .report-layout{display:grid;grid-template-columns:.75fr 1fr;gap:100px;align-items:start}.report-aside{position:sticky;top:120px}.aside-number{font-size:10px;letter-spacing:.18em;color:var(--red)}.report-aside h2{font-size:clamp(42px,5vw,65px);margin:25px 0}.report-aside>p{font-size:14px;line-height:1.9;color:#afa3a0;max-width:360px}.aside-note{display:flex;gap:14px;margin-top:35px;padding-top:22px;border-top:1px solid #382828;max-width:360px}.aside-note span{color:var(--red);font-size:20px}.aside-note p{color:#9f9290;font-size:12px;line-height:1.7;margin:0}.report-form{border:1px solid #3a2828;padding:34px;background:#100b0b}.form-heading{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}.form-heading>span,.optional{font-size:10px;color:#837775}.type-picker{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:26px}.type-picker button{display:flex;flex-direction:column;align-items:start;gap:8px;padding:17px;background:#160f0f;border:1px solid #3a2929;color:#fff;text-align:left;cursor:pointer}.type-picker button.selected{border-color:var(--red);background:#2a0d11}.type-picker button>span{color:var(--red);font-size:23px}.type-picker strong{font-size:13px;font-weight:600}.type-picker small{font-size:11px;color:#a49794}.form-row{display:grid;grid-template-columns:1fr 1fr;gap:15px}.field-help{font-size:10px;color:#827673;line-height:1.5}.submit-report{width:100%;margin-top:15px}.submit-report:disabled{opacity:.6}.privacy-note{font-size:10px;line-height:1.7;color:#776b69;margin:18px 0 0}
 @media(max-width:850px){.report-layout{grid-template-columns:1fr;gap:35px}.report-aside{position:static}.report-aside h2{font-size:48px}.report-form{padding:24px}}
 @media(max-width:480px){.form-row{grid-template-columns:1fr}.type-picker{grid-template-columns:1fr}}
 `]
})
export class ReportComponent {
 today=new Date().toISOString().slice(0,10);busy=false;error='';
 form:any={type:'LOST',title:'',category:'Electronics',dateOccurred:this.today,location:'',description:'',imageUrl:'',contactHint:''};
 constructor(private api:ApiService,private auth:AuthService,private router:Router){}
 submit(){
  this.error='';
  if(!this.auth.user()){void this.router.navigate(['/login'],{queryParams:{returnUrl:'/report'}});return;}
  this.busy=true;
  this.api.createItem({...this.form,imageUrl:this.form.imageUrl.trim()}).subscribe({next:r=>{this.busy=false;void this.router.navigate(['/item',r.item._id]);},error:e=>{this.busy=false;this.error=e?.error?.message||'Unable to publish report. Is the API running?';}});
 }
}
