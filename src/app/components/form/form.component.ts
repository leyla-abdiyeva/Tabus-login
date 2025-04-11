import {Component, OnInit} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  imports: [
    MatTable,
    NgForOf,
    MatColumnDef,
    FormsModule,
    MatHeaderCell,
    MatCell,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    NgIf,
    MatButton,
  ],
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  label = '';
  title = '';
  encrform = '';
  headerdata: any[] = [];
  tabledata: any[] = [];
  buttons: any[] = [];
  dataaction: any[] = [];

  displayedColumns: string[] = [];

  ngOnInit() {
    // Simulated response from API — replace this with your service call
    const result = {
      params: [
        {
          label: 'Account List',
          title: 'Account Details',
          encrform: 'ENCRYPTED_ID',
          tabledata: [
            { account_name: 'Cash', account_code: '101' },
            { account_name: 'Bank', account_code: '102' }
          ],
          headerdata: [
            { name: 'account_name', label: 'Account Name', type: 'TEXTFIELD' },
            { name: 'account_code', label: 'Account Code', type: 'TEXTFIELD' }
          ],
          buttons: [
            {
              buttonname: 'Save',
              actiontype: 'callFileWithCallBack',
              params: [{ callBackAction: 'saveAccounts', callBackModule: 'Accounts' }]
            }
          ],
          dataaction: []
        }
      ]
    };

    const form = result.params[0];
    this.label = form.label;
    this.title = form.title;
    this.encrform = form.encrform;
    this.headerdata = form.headerdata;
    this.tabledata = form.tabledata;
    this.buttons = form.buttons;
    this.dataaction = form.dataaction;
    this.displayedColumns = this.headerdata.map(h => h.name);
  }

  handleAction(button: any) {
    console.log('Action triggered:', button.buttonname);
    console.log('Data:', this.tabledata);
    // Add actual API logic here using button.params[0]
  }
}
