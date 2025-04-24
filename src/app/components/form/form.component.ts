import {Component, OnInit, inject} from '@angular/core';
import {MainService} from '../../core/services/main/main.service';
import {CookieService} from 'ngx-cookie-service';
import {FormsModule} from '@angular/forms';


@Component({
  selector: 'app-form',
  standalone: true,
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
  imports: [
    FormsModule,
  ]
})
export class FormComponent implements OnInit {
  private mainService = inject(MainService);
  private cookieService = inject(CookieService);

  ngOnInit() {
    this.loadForm("dEVtdEVWb2FwUlFWVThQVGVFaU5yZUJyWUt4K2cwRWl2TkFzSU9xMGZaYzdsUmdVbm8vbFpLM0htN3JnRDAwN3RBYzM0TWpsTnJPaFUrKzc4Tzlra0VZZ1V6NzAvbzhYSDdpb0pWNDh3STByWjRibkh1RnpGK2tWSHROdjZMeXptbFEzSjF6Um1qb3c4cmgwZ1dMMm8xY0crUXhtZGpEcFE0NG4xVUsyWWVlS25PTFRWYWRNbHYvaytBQzZsK3JLRHVwRTE0cHJLQWJXbUlZbDBFeXN0S1RwZ0doSkNremcxUUdjWDRtWDgwOHJTVXBQeGZvNjRhV3NwbkQrKzRVTnVmZ3U4MGV1WEZTZGprU1IwbiszVFViZ2RuZTFFM25DS3RCRVhPbkdTYStWNC9LZWQ0QVpFWkJJbnpMWHYrWHpveXlCOWRVVjBCVWhPQXlIbWJNK3R3PT0=");
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
        // Handle form response here
      },
      error: (err) => console.error('Error loading form:', err)
    });
  }


}
