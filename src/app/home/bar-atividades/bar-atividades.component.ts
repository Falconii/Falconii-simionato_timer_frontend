import { Component, OnInit } from '@angular/core';

declare var google: any;

@Component({
  selector: 'app-bar-atividades',
  templateUrl: './bar-atividades.component.html',
  styleUrls: ['./bar-atividades.component.css'],
})
export class BarAtividadesComponent implements OnInit {
  constructor() {
    google.charts.load('current', { packages: ['bar'] });
  }

  ngOnInit() {
    google.charts.setOnLoadCallback(this.drawChart);
  }

  drawChart() {
    var data = google.visualization.arrayToDataTable([
      ['Atividades', 'HRS PLAN', 'HRS EXEC', 'HRS DIR'],
      ['CONTABIL', 1000, 400, 200],
      ['FISCAL', 1170, 460, 250],
      ['RH', 660, 1120, 300],
    ]);

    var options = {
      chart: {
        title: 'Company Performance',
        subtitle: 'Sales, Expenses, and Profit: 2014-2017',
      },
    };

    var chart = new google.charts.Bar(
      document.getElementById('columnchart_material')
    );

    chart.draw(data, google.charts.Bar.convertOptions(options));
  }
}
