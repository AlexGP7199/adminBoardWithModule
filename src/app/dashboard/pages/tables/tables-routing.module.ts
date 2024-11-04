import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentTableComponent } from './content-table/content-table.component';

const routes: Routes = [
  {path: '', component: ContentTableComponent}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TablesRoutingModule { }
