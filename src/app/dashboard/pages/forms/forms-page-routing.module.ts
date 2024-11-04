import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentFormComponent } from './content-form/content-form.component';

const routes: Routes = [
  {path: '', component: ContentFormComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormsPageRoutingModule { }
