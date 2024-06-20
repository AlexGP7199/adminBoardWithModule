import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsPageRoutingModule } from './forms-page-routing.module';
import { UpdateFormComponent } from './update-form/update-form.component';
import { AddFormComponent } from './add-form/add-form.component';
import { UserLogInFormComponent } from './user-log-in-form/user-log-in-form.component';
import { ContentFormComponent } from './content-form/content-form.component';


@NgModule({
  declarations: [
    UpdateFormComponent,
    AddFormComponent,
    UserLogInFormComponent,
    ContentFormComponent
  ],
  imports: [
    CommonModule,
    FormsPageRoutingModule
  ], exports : [
    UpdateFormComponent,
    AddFormComponent,
    UserLogInFormComponent
  ]
})
export class FormsPageModule { }
