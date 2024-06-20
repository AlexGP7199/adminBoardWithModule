import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApexOptions } from 'apexcharts';

@Component({
  selector: 'app-lineal-chart',
  templateUrl: './lineal-chart.component.html',
  styleUrl: './lineal-chart.component.css'
})
export class LinealChartComponent implements OnInit {
  @ViewChild('areaChart', { static: true }) chartElement!: ElementRef;
  public chartOptions: ApexOptions;
  constructor(){
    this.chartOptions = {
      chart: {
        height: "100%",
        width: "100%",
        type: "area",
        fontFamily: "Inter, sans-serif",
        dropShadow: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      tooltip: {
        enabled: true,
        x: {
          show: false,
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          opacityFrom: 0.55,
          opacityTo: 0,
          shade: "#FF2401", // Cambia a rojo
          gradientToColors: ["#FF2401"], // Cambia a rojo
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 4,
        colors: ["#FF2401"] // Cambia a rojo
      },
      grid: {
        show: false,
        strokeDashArray: 4,
        padding: {
          left: 2,
          right: 2,
          top: 0
        },
      },
      series: [
        {
          name: "New users",
          data: [6500, 6418, 6456, 6526, 6356, 6456, 6600, 6500, 6700, 6500, 6418, 6456, 6526, 6356, 6456, 6600, 6500, 6700],
          color: "#FF2401", // Cambia a rojo
        },
      ],
      xaxis: {
        categories: ['01 February', '02 February', '03 February', '04 February', '05 February', '06 February', '07 February'],
        labels: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        show: false,
      },
    };
  }

  ngOnInit(): void {
    if (this.chartElement && typeof ApexCharts !== 'undefined') {
      const chart = new ApexCharts(this.chartElement.nativeElement, this.chartOptions as ApexOptions);
      chart.render();
    }
  }


}
