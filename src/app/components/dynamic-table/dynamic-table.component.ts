import {Component, Input, Output, EventEmitter} from '@angular/core';
import {
  IgxColumnComponent,
  IgxGridComponent,
  IgxGridModule
} from 'igniteui-angular';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  imports: [
    IgxGridModule,
    CommonModule,
    IgxGridComponent,
    IgxColumnComponent,
    FormsModule
  ],
  styleUrls: ['./dynamic-table.component.css']
})
export class DynamicTableComponent {
  @Input() tableId!: string;
  @Input() columns: any[] = [];
  @Input() data: any[] = [];

  @Output() dataChange = new EventEmitter<{ id: string; data: any[] }>();

  onEditDone() {
    this.dataChange.emit({ id: this.tableId, data: this.data });
  }

  onCellEdit(event: any) {
    // Simple validation: quantity and amount must be positive
    const field = event.column.field;
    if ((field === 'quantity' || field === 'amount') && (event.newValue <= 0 || isNaN(event.newValue))) {
      event.cancel = true;
    }
  }

}
