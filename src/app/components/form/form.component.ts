import { Component, OnInit, inject } from '@angular/core';
import { MainService } from '../../core/services/main/main.service';
import { StoreService } from '../../core/services/store/store.service';
import { IGX_TREE_GRID_DIRECTIVES, IgxGridComponent, IgxButtonDirective } from 'igniteui-angular';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MatCell,
  MatCellDef, MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';

@Component({
  selector: 'app-form',
  standalone: true,
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
  imports: [
    IgxGridComponent,
    IGX_TREE_GRID_DIRECTIVES,
    IgxButtonDirective,
    NgIf,
    NgForOf,
    FormsModule,
    MatTable,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatButton,
    MatCellDef,
    MatHeaderCellDef,
    MatColumnDef,
    MatHeaderRowDef,
    MatRowDef,
  ]
})
export class FormComponent implements OnInit {
  private storeService = inject(StoreService);
  private mainService = inject(MainService);

  label = '';
  title = '';
  encrform = '';
  tabno = '';
  headerdata: any[] = [];
  tabledata: any[] = [];
  buttons: any[] = [];
  dataaction: any[] = [];
  displayedColumns: string[] = [];

  ngOnInit(): void {
    this.mainService.formData$.subscribe((response: any) => {
      const action = response?.actions?.find((a: any) => a.actiontype === 'getForm');
      if (action?.receivedData?.params?.length) {
        this.loadForm(action.receivedData.params[0]);
      }
      console.log('formdata',this.loadForm);
    });

    this.handleAction(0);
    let datas = {
      'frontend_post': "init",
    };
    console.error(datas);

    const initPayload = {
      frontend_post: "init"
    };

    this.storeService.onLoadData(initPayload).subscribe(response => {
      this.storeService.actionsStore(response); // handle response with actionsStore()
    });

  }

  loadForm(form: any): void {
    this.label = form.label || '';
    this.title = form.title || '';
    this.encrform = form.encrform || '';
    this.tabno = form.tabno || '';
    this.headerdata = form.headerdata || [];
    this.tabledata = form.tabledata || [];
    this.buttons = form.buttons || [];
    this.dataaction = form.dataaction || [];
    this.displayedColumns = this.headerdata.map(h => h.name);
  }

  handleAction(button: any): void {
    console.log('Action:', button.buttonname);
    console.log('Data:', this.tabledata);
    console.log('Form ID:', this.encrform, 'Tab:', this.tabno);

    const data = {
      actions: [
        {
          actiontype: button.actiontype,
          receivedData: {
            tabledata: this.tabledata,
            tabno: this.tabno,
            encrform: this.encrform,
            ...button.params?.[0]
          }
        }
      ]
    };

    this.mainService.sendData(data);
  }
}
