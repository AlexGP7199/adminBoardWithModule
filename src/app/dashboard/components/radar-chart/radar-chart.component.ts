import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApexOptions } from 'apexcharts';

@Component({
  selector: 'app-radar-chart',
  templateUrl: './radar-chart.component.html',
  styleUrl: './radar-chart.component.css'
})
export class RadarChartComponent implements OnInit{

  ngOnInit(): void {
    if (this.chartElement && typeof ApexCharts !== 'undefined') {
      const chart = new ApexCharts(this.chartElement.nativeElement, this.chartOptions as ApexOptions);
      chart.render();
    }
  }

  @ViewChild('radarChart', { static: true }) chartElement!: ElementRef;
  public chartOptions: ApexOptions;
  constructor(){
    this.chartOptions = {
      chart: {
          height: '100%',
          width: '100%',
          type: 'radar',
          dropShadow: {
            enabled: false,
          },
          toolbar: {
            show: false,
          },
      },
      series: [{
          name: 'Series 1',
          data: [80, 50, 30, 40, 100, 20],
      }],
      
      colors: ['#FF0000'],
      yaxis:{
        show: false
      },
      xaxis: {
          categories: ['January', 'February', 'March', 'April', 'May', 'June']
      },
      fill: {
        opacity: 0.5,
        colors: ['#FF0000']
      },
      stroke: {
          show: true,
          width: 2,
          colors: ['#FF0000'],
          dashArray: 0
      },
      markers: {
          size: 5,
          colors: ['#FF0000'],
          strokeColors: '#FF0000',
          strokeWidth: 2,
      },
  }
  }


}
