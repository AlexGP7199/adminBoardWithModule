import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsRoutingModule } from './forms-routing.module';
import { FormsFancyComponent } from './components/forms-fancy/forms-fancy.component';
import { FormStandarComponent } from './components/form-standar/form-standar.component';


@NgModule({
  declarations: [
    FormsFancyComponent,
    FormStandarComponent
  ],
  imports: [
    CommonModule,
    FormsRoutingModule
  ]
})
export class FormsModule { }
