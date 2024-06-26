import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsFancyComponent } from './forms/components/forms-fancy/forms-fancy.component';

const routes: Routes = [
  {path: '', redirectTo:'tte',pathMatch: 'full'},
  {path: 'tte', component:FormsFancyComponent},
  {path: 'Dashboard', loadChildren:() => import('./dashboard/dashboard.module').then((m) => m.DashboardModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
