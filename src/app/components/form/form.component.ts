import {Component, OnInit, inject, Input, ViewContainerRef, ViewChild, ComponentRef} from '@angular/core';
import {MainService} from '../../core/services/main/main.service';
import {CookieService} from 'ngx-cookie-service';
import {FormsModule} from '@angular/forms';
import {DynamicButtonComponent} from '../dynamic-button/dynamic-button.component';
import {TableComponent} from '../table/table.component';

@Component({
  selector: 'app-form',
  standalone: true,
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
  imports: [
    FormsModule,
    DynamicButtonComponent,
  ]
})
export class FormComponent implements OnInit {
  @ViewChild('tableContainer', { read: ViewContainerRef }) tableContainer!: ViewContainerRef;
  tableComponentRef!: ComponentRef<TableComponent>;
  @Input() encrVar!: string;

  private mainService = inject(MainService);
  private cookieService = inject(CookieService);

  ngOnInit() {
    // this.loadForm("dEVtdEVWb2FwUlFWVThQVGVFaU5yZUJyWUt4K2cwRWl2TkFzSU9xMGZaYzdsUmdVbm8vbFpLM0htN3JnRDAwN3RBYzM0TWpsTnJPaFUrKzc4Tzlra0VZZ1V6NzAvbzhYSDdpb0pWNDh3STByWjRibkh1RnpGK2tWSHROdjZMeXptbFEzSjF6Um1qb3c4cmgwZ1dMMm8xY0crUXhtZGpEcFE0NG4xVUsyWWVlS25PTFRWYWRNbHYvaytBQzZsK3JLRHVwRTE0cHJLQWJXbUlZbDBFeXN0S1RwZ0doSkNremcxUUdjWDRtWDgwOHJTVXBQeGZvNjRhV3NwbkQrKzRVTnVmZ3U4MGV1WEZTZGprU1IwbiszVFViZ2RuZTFFM25DS3RCRVhPbkdTYStWNC9LZWQ0QVpFWkJJbnpMWHYrWHpveXlCOWRVVjBCVWhPQXlIbWJNK3R3PT0=");
    this.mainService.selectedEncrVar$.subscribe(encrVar => {
      if (encrVar) {
        this.loadTableData(encrVar);
        console.log('✅ EncrVar received:', encrVar);
        alert(encrVar);
      }
    });

    console.log('Received EncrVar:', this.encrVar);
    this.loadTableData(this.encrVar);
  }

  createComponent(){
    this.tableComponentRef = this.tableContainer.createComponent(TableComponent);
  }


  loadTableData(encrVar: string): void {
    const payload = {
      frontend_post: 'getForm',
      encrVar,
      langSyst: this.cookieService.get('Language'),
      parentIsModal: 0
    };


    this.mainService.fetchForm(payload).subscribe({
      next: (response) => {
        console.log('📦 Full form response:', response);

        const action = response?.actions?.[0];
        const formData = action?.receivedData;

        if (!formData || !formData.elements) {
          console.error('Missing form elements:', formData);
          return;
        }

        console.log('Received form data:', formData);
        this.renderTableElements(formData.elements); // <- your rendering logic
      },
      error: (err) => console.error('Error loading form:', err)
    });
  }



  renderTableElements(elements: any[]): void {
    this.tableContainer.clear();

    elements.forEach(element => {
      if (element.type === 'localTable') {
        const compRef = this.tableContainer.createComponent(TableComponent);
        compRef.instance.dataSource = element.rows || []; // or any relevant data
        // Store or subscribe if needed
      }
      // else if (element.type === 'button') { ... } // Handle other components
    });
  }




  updatedTables: { [key: string]: any[] } = {};


  onSubmit() {
    console.log('Submitted Data:', this.updatedTables);
  }

}
