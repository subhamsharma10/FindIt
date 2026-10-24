import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { AuthComponent } from './pages/auth.component';
import { BrowseComponent } from './pages/browse.component';
import { ReportComponent } from './pages/report.component';
import { DashboardComponent } from './pages/dashboard.component';
import { ItemDetailComponent } from './pages/item-detail.component';
import { AdminComponent } from './pages/admin.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: AuthComponent },
  { path: 'register', component: AuthComponent },
  { path: 'browse', component: BrowseComponent },
  { path: 'report', component: ReportComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'item/:id', component: ItemDetailComponent },
  { path: 'admin', component: AdminComponent },
  { path: '**', redirectTo: '' }
];
