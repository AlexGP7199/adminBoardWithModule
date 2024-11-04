import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from './components/header/header.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { ContentComponent } from './components/content/content.component';
import { SimpleCardComponent } from './shared/components/simple-card/simple-card.component';
import { RadarChartComponent } from './shared/components/radar-chart/radar-chart.component';
import { LinealChartComponent } from './shared/components/lineal-chart/lineal-chart.component';
import { ListWithImgComponent } from './shared/components/list-with-img/list-with-img.component';
import { CircularChartComponent } from './shared/components/circular-chart/circular-chart.component';
import { BarChartComponent } from './shared/components/bar-chart/bar-chart.component';
import { FormsPageModule } from './pages/forms/forms-page.module';
import { TablesModule } from './pages/tables/tables.module';
import { HorariosComponent } from '../horarios/horarios.component';
import { RouterModule } from '@angular/router';





@NgModule({
  declarations: [
    HeaderComponent,
    SidenavComponent,
    ContentComponent,
    SimpleCardComponent,
    RadarChartComponent,
    LinealChartComponent,
    ListWithImgComponent,
    CircularChartComponent,
    HorariosComponent,
    BarChartComponent],
  imports: [
    CommonModule,
    FormsPageModule,
    TablesModule,
    RouterModule // Asegúrate de importar RouterModule aquí

  ], exports : [
    SidenavComponent,
    HeaderComponent,
    ContentComponent,
    SimpleCardComponent,
    RadarChartComponent,
    LinealChartComponent,
    ListWithImgComponent,
    CircularChartComponent,
    BarChartComponent,
    HorariosComponent
  ]
})
export class DasboardModule { }
