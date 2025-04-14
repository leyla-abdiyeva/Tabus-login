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
  private cookieService = inject(CookieService);


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
    console.error('Received actions:', actions);
    if (!Array.isArray(actions)) {
      console.warn('No actions array found in response.');
      return;
    }

    for (let i = 0; i < actions.length; i++) {
      alert(JSON.stringify(actions[i], null, 2));
      const action = actions[i];
      const type = action.actiontype;

      console.log(`Processing action #${i + 1} of type: ${type}`);
      console.log('Action content:', action);

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

        case 'getForm': {
          const formPayload = this.extractReceivedData(action);

          if (!formPayload.encrVar) {
            console.warn("Missing encrVar in getForm action:", formPayload);
            break;
          }
          this.onLoadData(formPayload).subscribe(response => {
            console.log("↳ getForm response (nested):", response);
          });
          break;
        }

        default:
          console.log(`→ Unhandled action type "${type}"`, action);
      }
    }
  }

  private extractReceivedData(action: any): any {
    const rd = action.receivedData ?? {};
    return {
      frontend_post: rd.frontend_post || action.frontend_post || 'getForm',
      encrVar: rd.encrVar,
      token: rd.token,
      entity: rd.entity,
      langSyst: rd.langSyst || 'en'
    };
  }



  fetchAllAppData(): void {
    const lang = this.cookieService.get('Language');

    const requests = [
      {
        name: 'getUserData',
        data: {frontend_post: 'getUserData', langSyst: lang}
      },
      {
        name: 'getMenu',
        data: {frontend_post: 'getMenu', langSyst: lang}
      },
      {
        name: 'getFavorites',
        data: {frontend_post: 'getFavorites', langSyst: lang}
      },
      {
        name: 'getInfo',
        data: {frontend_post: 'getInfo', langSyst: lang}
      }
    ];
    console.log('this is requests', requests)

    requests.forEach(req => {
      this.onLoadData(req.data).subscribe(response => {
        console.log(`📦 ${req.name} response:`, response);
        this.actionsStore(response); // Optional: to route through your existing logic
      });
    });
  }


}
