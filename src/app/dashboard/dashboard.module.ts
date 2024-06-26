import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { SimpleCardComponent } from './components/simple-card/simple-card.component';
import { RadarChartComponent } from './components/radar-chart/radar-chart.component';
import { ListWithImgComponent } from './components/list-with-img/list-with-img.component';
import { LinealChartComponent } from './components/lineal-chart/lineal-chart.component';
import { CircularChartComponent } from './components/circular-chart/circular-chart.component';
import { BartChartComponent } from './components/bart-chart/bart-chart.component';
import { GraphicCardsComponent } from './pages/graphic-cards/graphic-cards.component';
import { GraphicChartsComponent } from './pages/graphic-charts/graphic-charts.component';


@NgModule({
  declarations: [
    SimpleCardComponent,
    RadarChartComponent,
    ListWithImgComponent,
    LinealChartComponent,
    CircularChartComponent,
    BartChartComponent,
    GraphicCardsComponent,
    GraphicChartsComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule
  ], exports :[
    SimpleCardComponent,
    RadarChartComponent,
    ListWithImgComponent,
    LinealChartComponent,
    CircularChartComponent,
    BartChartComponent,
    GraphicCardsComponent,
    GraphicChartsComponent
  ]
})
export class DashboardModule { }
