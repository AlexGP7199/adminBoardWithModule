import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApexOptions } from 'apexcharts';

@Component({
  selector: 'app-bart-chart',
  templateUrl: './bart-chart.component.html',
  styleUrl: './bart-chart.component.css'
})
export class BartChartComponent implements OnInit {

  ngOnInit(): void {
    if (this.chartElement && typeof ApexCharts !== 'undefined') {
      const chart = new ApexCharts(this.chartElement.nativeElement, this.chartOptions as ApexOptions);
      chart.render();
    }
  }
  
  @ViewChild('barChart', { static: true }) chartElement!: ElementRef;
  public chartOptions: ApexOptions;
  constructor(){
    this.chartOptions = {
      chart: {
        type: 'bar',
        height: "100%",
        width: "100%",
        fontFamily: "Inter, sans-serif",
        dropShadow: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      fill: {
        colors: ['#F44336', '#E91E63', '#9C27B0']

      },
      series: [{
        data: [{
          x: 'category A',
          y: 10,
          fillColor: '#003049'
        }, {
          x: 'category B',
          y: 18,
          fillColor: '#d62828'
        }, {
          x: 'category C',
          y: 13,
          fillColor: '#780000'
        },{
          x: 'category D',
          y: 6,
          fillColor: '#fcbf49'
        },]
      }]
    }
  }

  
}
