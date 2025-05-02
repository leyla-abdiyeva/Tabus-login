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
        this.loadForm(encrVar);
        console.log('✅ EncrVar received:', encrVar);
        alert(encrVar);
      }
    });

    console.log('Received EncrVar:', this.encrVar);
    this.loadForm(this.encrVar);
    this.loadTable();
  }


  loadTable(): void {
    this.tableContainer.clear(); // clear existing table if any
    this.tableComponentRef = this.tableContainer.createComponent(TableComponent);

    // Example: pass data or form context
    this.tableComponentRef.instance.dataSource = [
      { uid: '123', Code: 'Err01', Template: 'Some error...' },
      // ...
    ];

    // Optional: communicate between form ↔ table via Input/Output or shared service
  }

  loadForm(encrVar: string): void {
    const payload = {
      frontend_post: 'getForm',
      encrVar: encrVar,
      langSyst: this.cookieService.get('Language'),
      parentIsModal: 0
    };

    this.mainService.fetchForm(payload).subscribe({
      next: (response) => {
        const receivedEncrVar = response?.actions?.[0]?.receivedData?.encrVar;
        console.log('🔍 Received encrVar from backend:', receivedEncrVar);

        // Optional: log full response
        console.log('📦 Full form response:', response);
      },
      error: (err) => console.error('❌ Error loading form:', err)
    });
  }



  updatedTables: { [key: string]: any[] } = {};

  onTableDataChange(event: { id: string, data: any[] }) {
    this.updatedTables[event.id] = event.data;
    console.log('Updated Tables:', this.updatedTables);
  }

  onSubmit() {
    console.log('Submitted Data:', this.updatedTables);
  }

}
