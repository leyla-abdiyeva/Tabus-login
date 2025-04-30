import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {FormService} from '../form/form.service';

@Injectable({ providedIn: 'root' })
export class StoreService {
  mainBase: string = "https://dev.tabus.net/";
  private redirectval_path = "main/html/handler.php";
  private http = inject(HttpClient);
  private cookieService = inject(CookieService);
  private formService = inject(FormService);

  private actionMap: Record<string, (params: any) => void> = {
    updateUserData: (params) => localStorage.setItem('userData', JSON.stringify(params)),
    updateMenu: (params) => {
      localStorage.setItem('menu', JSON.stringify(params));
      console.log('Menu updated:', params);
    },
    showForm: (params) => this.formService.handleShowForm(params),
    updateForm: (params) => this.formService.handleUpdateForm(params),
  };

  constructor() {}

  public onLoadData(payload: any): Observable<any> {
    const token = localStorage.getItem('token');
    const entity = localStorage.getItem('entity');

    if (!token || !entity) {
      alert('Missing token or entity');
      return of('error');
    }

    payload.token = token;
    payload.entity = entity;

    console.log('Sending to server:', payload);

    return this.http.post<any>(`${this.mainBase + this.redirectval_path}`, JSON.stringify(payload), {
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

  public actionsStore(response: any): void {
    if (!response || response === 'error') {
      console.warn('Invalid response:', response);
      return;
    }
    console.log("Recieved data", response);
    const actions = response.actions;
    if (!Array.isArray(actions)) {
      console.warn('No actions array in response');
      return;
    }

    for (const action of actions) {
      switch (action.actiontype) {
        case 'initialization':
          this.handleInitialization(action);
          break;
        case 'updateUserData':
          localStorage.setItem('userData', JSON.stringify(action.params));
          break;
        case 'updateMenu':
          localStorage.setItem('menu', JSON.stringify(action.params));
          console.log('Menu updated:', action.params);
          break;
        default:
          console.warn('Unhandled action:', action);
          break;
      }
    }
  }

  private handleInitialization(action: any): void {
    const { token, entity } = action;
    localStorage.setItem('token', token);
    localStorage.setItem('entity', entity);

    const lang = this.cookieService.get('Language');

    const initRequests = [
      'getUserData',
      'getMenu',
      'getFavorites',
      'getInfo'
    ];

    initRequests.forEach(req => {
      this.onLoadData({ frontend_post: req, langSyst: lang })
        .subscribe(res => this.actionsStore(res));
    });

    setTimeout(() => {
      const expiration = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      this.cookieService.set('test_login', localStorage.getItem('userName') || '', expiration, '/');
      (window as any).dialogService.shows = 'form';
      (window as any).overlayService.closeDialog('OverlayLoginComponent');
    }, 1000);
  }

  public fetchAllAppData(): void {
    const lang = this.cookieService.get('Language');

    const requests = [
      { frontend_post: 'getUserData', langSyst: lang },
      { frontend_post: 'getMenu', langSyst: lang },
      { frontend_post: 'getFavorites', langSyst: lang },
      { frontend_post: 'getInfo', langSyst: lang }
    ];

    requests.forEach(data => {
      this.onLoadData(data).subscribe(res => this.actionsStore(res));
    });
  }
}



