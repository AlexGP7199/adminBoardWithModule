import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TablesRoutingModule } from './tables-routing.module';
import { TableWithImgComponent } from './table-with-img/table-with-img.component';
import { ContentTableComponent } from './content-table/content-table.component';



@NgModule({
  declarations: [TableWithImgComponent, ContentTableComponent],
  imports: [
    CommonModule,
    TablesRoutingModule
  ], exports : [
    TableWithImgComponent
  ]
})
export class TablesModule { }
