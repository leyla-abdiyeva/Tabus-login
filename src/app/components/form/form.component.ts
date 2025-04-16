import { Component, OnInit, inject } from '@angular/core';
import { MainService } from '../../core/services/main/main.service';
import { StoreService } from '../../core/services/store/store.service';
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
  // private storeService = inject(StoreService);
  // private mainService = inject(MainService);
  //
  // label = '';
  // title = '';
  // encrform = '';
  // tabno = '';
  // headerdata: any[] = [];
  // tabledata: any[] = [];
  // buttons: any[] = [];
  // dataaction: any[] = [];
  // displayedColumns: string[] = [];
  //
  // ngOnInit(): void {
  //   this.storeService.formDataSubject.subscribe((response: any) => {
  //     const action = response?.actions?.find((a: any) => a.actiontype === 'getForm');
  //     if (action?.receivedData?.params?.length) {
  //       this.loadForm(action.receivedData.params[0]);
  //     }
  //     console.log('formdata',this.loadForm);
  //   });
  //
  //   const localInitData = {
  //     actions: [
  //       {
  //         actiontype: 'init',
  //         receivedData: { frontend_post: 'init' }
  //       }
  //     ],
  //     console: '',
  //     errors: ''
  //   };
  //
  //   setTimeout(() => {
  //       this.storeService.actionsStore(localInitData);
  //   }, 0);
  //
  //
  //   this.handleAction(0);
  //
  //   let datas = {
  //     'frontend_post': "init",
  //   };
  //   console.error(datas);
  //
  //   const initPayload = {
  //     frontend_post: "init"
  //   };
  //
  //   this.storeService.onLoadData(initPayload).subscribe(response => {
  //     this.storeService.actionsStore(response); // handle response with actionsStore()
  //   });
  //
  // }
  //
  // loadForm(form: any): void {
  //   console.log('✅ formdata loaded:', form);
  //
  //   this.label = form.label || '';
  //   this.title = form.title || '';
  //   this.encrform = form.encrform || '';
  //   this.tabno = form.tabno || '';
  //   this.headerdata = form.headerdata || [];
  //   this.tabledata = form.tabledata || [];
  //   this.buttons = form.buttons || [];
  //   this.dataaction = form.dataaction || [];
  //   this.displayedColumns = this.headerdata.map(h => h.name);
  //
  //   console.log('🧾 tabledata:', this.tabledata);
  // }
  //
  // handleAction(button: any): void {
  //   console.log('Action:', button.buttonname);
  //   console.log('Data:', this.tabledata);
  //   console.log('Form ID:', this.encrform, 'Tab:', this.tabno);
  //
  //   const data = {
  //     actions: [
  //       {
  //         actiontype: button.actiontype,
  //         receivedData: {
  //           tabledata: this.tabledata,
  //           tabno: this.tabno,
  //           encrform: this.encrform,
  //           ...button.params?.[0]
  //         }
  //       }
  //     ]
  //   };
  //
  //   this.mainService.sendData(data);
  // }

  private storeService = inject(StoreService);

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
    // Step 1: trigger init
    const initPayload = {
      actions: [
        {
          actiontype: 'init',
          receivedData: { frontend_post: 'init' }
        }
      ]
    };
    console.log('📤 Sending initPayload:', initPayload);

    // This sends your initial request, which contains the encrVar inside
    this.storeService.onLoadData(initPayload).subscribe(initResponse => {
      console.log('🧩 Init response:', initResponse);

      const getFormAction = initResponse?.actions?.find((a: any) => a.actiontype === 'getForm');
      const encrVar = getFormAction?.receivedData?.encrVar;

      if (!encrVar) {
        console.warn('⚠️ No encrVar found in init response.');
        return;
      }

      // Step 2: use that encrVar to get the actual form
      const getFormPayload = {
        frontend_post: 'getForm',
        encrVar: encrVar
      };

      this.storeService.onLoadData(getFormPayload).subscribe(formResponse => {
        console.log('📦 Final getForm data:', formResponse);

        const formData = formResponse?.actions?.find((a: any) => a.actiontype === 'getForm')?.receivedData?.params?.[0];

        if (formData) {
          this.loadForm(formData);
        } else {
          console.warn('⚠️ No formData (params[0]) found in response.');
        }
      });
    });

    console.log('🚀 FormComponent initialized');

  }

  loadForm(form: any): void {
    console.log('✅ formdata loaded:', form);

    this.label = form.label || '';
    this.title = form.title || '';
    this.encrform = form.encrform || '';
    this.tabno = form.tabno || '';
    this.headerdata = form.headerdata || [];
    this.tabledata = form.tabledata || [];
    this.buttons = form.buttons || [];
    this.dataaction = form.dataaction || [];
    this.displayedColumns = this.headerdata.map(h => h.name);

    console.log('🧾 tabledata:', this.tabledata);
  }

  handleAction(button: any): void {
    console.log('🟡 Action triggered:', button?.buttonname);
    console.log('📄 Current tabledata:', this.tabledata);
    console.log('🆔 Form ID:', this.encrform, '| Tab:', this.tabno);

    const payload = {
      actions: [
        {
          actiontype: button.actiontype,
          receivedData: {
            tabledata: this.tabledata,
            tabno: this.tabno,
            encrform: this.encrform,
            ...button.params?.[0] // optional extra params
          }
        }
      ]
    };

    this.storeService.onLoadData(payload).subscribe(response => {
      console.log('📬 Action response:', response);

      // Optional: re-run loadForm if action modifies data
      const updatedForm = response?.actions?.find((a: any) => a.actiontype === 'getForm')?.receivedData?.params?.[0];
      if (updatedForm) {
        this.loadForm(updatedForm);
      }
    });
  }

}
