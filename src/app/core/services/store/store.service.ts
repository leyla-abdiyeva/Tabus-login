import {inject, Injectable, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private mainBase: string = "https://dev.tabus.net/";
  private redirectval_path = "main/html/handler.php"; // Path to your PHP handler

  private http = inject(HttpClient);
  private cookieService= inject(CookieService);


  constructor() {
  }

  public onLoadData(sendDatas: any): Observable<any> {
    // Ensure default values are set, even during login
    // const token = localStorage.getItem('token') ?? '';
    const token = this.cookieService.get('uID_i') || '';
    const entity = localStorage.getItem('entity') ?? 'main'; // Default entity
    const langSyst = localStorage.getItem('langSyst') ?? 'en'; // Default language

    // Attach them to all requests
    sendDatas.token = token;
    sendDatas.entity = entity;
    sendDatas.langSyst = langSyst;

    const body = JSON.stringify(sendDatas);

    return this.http.post<any>(`${this.mainBase + this.redirectval_path}`, body, {
      responseType: 'json',
      withCredentials: true
    }).pipe(
      map(response => (response && response !== 'error') ? response : 'error'),
      catchError(error => {
        console.error('Data load error:', error);
        return of('error');
      })
    );
  }

  initService(): void {
    const initData = {};
    this.onLoadData(initData).subscribe(response => {
      console.log('Initial load response (manual call):', response);
    });
  }


  actionsStore(receivedData: any) {
    if (!receivedData || receivedData === 'error') {
      console.warn('Received invalid or error response:', receivedData);
      return;
    }

    console.log('Received data:', receivedData);

    const actions = receivedData.actions;

    if (!Array.isArray(actions)) {
      console.warn('No actions array found in response.');
      return;
    }

    for (let i = 0; i < actions.length; i++) {
      const action = actions[i];
      const type = action.actiontype;

      console.log(`Processing action #${i + 1} of type: ${type}`);
      console.log('Action content:', action);

      // Here you could expand with actual logic based on actiontype
      switch (type) {
        case 'init':
          console.log('→ Init action:', action.receivedData);
          break;

        case 'updateInfo':
          console.log('→ Update Info Params:', action.params);
          break;

        case 'login':
          console.log('→ Login action:', action.params || action.receivedData);
          break;

        // Add other types as needed...
        default:
          console.log(`→ Unhandled action type "${type}"`, action);
      }
    }
  }
}
