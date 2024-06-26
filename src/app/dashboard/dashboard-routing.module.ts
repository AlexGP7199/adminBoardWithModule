import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GraphicCardsComponent } from './pages/graphic-cards/graphic-cards.component';

const routes: Routes = [
  {path:'', redirectTo: 'cards'},
  {path:'cards', component:GraphicCardsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
