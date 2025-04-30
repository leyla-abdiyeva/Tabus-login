import { Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { LoginComponent } from './features/login/login.component';
import {FormComponent} from './components/form/form.component';
import {DynamicTableComponent} from './components/dynamic-table/dynamic-table.component';
// import {authGuard} from './core/guards/auth.guard';

export const routes: Routes =[
  { path: '', redirectTo: '/login', pathMatch: 'full' },  // Redirect to login if root is accessed
  { path: 'login', component: LoginComponent },  // Login route accessible without any guard
  { path: 'main', component: MainComponent},  // Main route protected by authGuard
  { path: 'form', component: FormComponent},
  { path: 'table', component: DynamicTableComponent},
];
