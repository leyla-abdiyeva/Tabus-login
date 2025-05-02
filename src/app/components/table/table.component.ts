import {AfterViewInit, Component, ComponentRef, Injector, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableModule
} from '@angular/material/table';
import {MatButton, MatButtonModule} from '@angular/material/button';
import {MatCard, MatCardHeader, MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-table',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatTable,
    MatHeaderCell,
    MatCell,
    MatButton,
    MatCellDef,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatColumnDef,
    MatCard,
    MatCardHeader,
    MatCardModule
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})

export class TableComponent implements OnInit {
  formTitle = 'Errors';  // Title for the form (from your JSON)
  displayedColumns: string[] = ['uid', 'Code', 'Type', 'Language', 'Template', 'Source', 'SourceAction', 'Action'];
  dataSource: any = [];  // DataSource for the table

  ngOnInit() {
    };


  constructor() {}

}
