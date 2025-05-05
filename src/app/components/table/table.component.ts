import {Component, OnInit} from '@angular/core';
import {IgxGridComponent, IgxGridModule} from 'igniteui-angular';

@Component({
  standalone: true,
  selector: 'app-table',
  imports: [
    IgxGridModule,
    IgxGridComponent
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})

export class TableComponent implements OnInit {
  // dataSource: any = [];  // DataSource for the table
  public dataSource = [
    { ID: 1, Name: 'Alice', Age: 30 },
    { ID: 2, Name: 'Bob', Age: 25 },
    { ID: 3, Name: 'Charlie', Age: 35 }
  ];
  ngOnInit() {
    };


  constructor() {}

}
