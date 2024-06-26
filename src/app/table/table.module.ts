import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableRoutingModule } from './table-routing.module';
import { TableT1Component } from './components/table-t1/table-t1.component';
import { TableFancyComponent } from './components/table-fancy/table-fancy.component';


@NgModule({
  declarations: [
    TableT1Component,
    TableFancyComponent
  ],
  imports: [
    CommonModule,
    TableRoutingModule
  ]
})
export class TableModule { }
