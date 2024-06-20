import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentComponent } from './components/content/content.component';

const routes: Routes = [
  { path: '', redirectTo: 'Dashboard', pathMatch:'full'},
  { path: 'Dashboard', component : ContentComponent },
  { path:'FormContent', loadChildren:()=> import('./pages/forms/forms-page.module').then((m) => m.FormsPageModule)},
  {path : 'TablesContent', loadChildren:()=> import('./pages/tables/tables.module').then((m) => m.TablesModule)}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DasboardRoutingModule { }
