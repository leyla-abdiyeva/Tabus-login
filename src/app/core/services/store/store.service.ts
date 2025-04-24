// import {inject, Injectable} from '@angular/core';
// import {Observable, of} from 'rxjs';
// import {catchError, map} from 'rxjs/operators';
// import {HttpClient} from '@angular/common/http';
// import {CookieService} from 'ngx-cookie-service';
//
// @Injectable({
//   providedIn: 'root'
// })
// export class StoreService {
//   private mainBase: string = "https://dev.tabus.net/";
//   private redirectval_path = "main/html/handler.php"; // Path to your PHP handler
//
//   private http = inject(HttpClient);
//   private cookieService = inject(CookieService);
//
//   constructor() {
//   }
//
//   public onLoadData(sendDatas: any): Observable<any> {
//     // Ensure default values are set, even during login
//
//     // open only for development (to work with localhost)
//     if (localStorage.getItem('token') !== null || localStorage.getItem('token') !== undefined){
//       sendDatas['token'] = localStorage.getItem('token');
//       sendDatas['entity'] = localStorage.getItem('entity');
//     }else {
//       alert("missing token");
//     }
//
//     console.log('Sending to server: ');
//     console.log(sendDatas);
//
//
//     // const token = this.cookieService.get('uID_i') || "68075d6c56e15";
//     // const entity = localStorage.getItem('entity') ?? 'dev';
//     // const langSyst = localStorage.getItem('langSyst') ?? 'az';
//     //
//     // // Attach them to all requests
//     // sendDatas.token = token;
//     // sendDatas.entity = entity;
//     // sendDatas.langSyst = langSyst;
//
//     const body = JSON.stringify(sendDatas);
//
//
//     return this.http.post<any>(`${this.mainBase + this.redirectval_path}`, body, {
//       responseType: 'json',
//       withCredentials: true
//     }).pipe(
//       map(response => (response && response !== 'error') ? response : 'error'),
//       catchError(error => {
//         console.error('Data load error:', error);
//         return of('error');
//       })
//     );
//   }
//
//   actionsStore(receivedData: any) {
//     if (!receivedData || receivedData === 'error') {
//       console.warn('Received invalid or error response:', receivedData);
//       return;
//     }
//
//     const actions = receivedData.actions;
//     if (!Array.isArray(actions)) {
//       console.warn('No actions array found in response.');
//       return;
//     }
//
//     for (let i = 0; i < actions.length; i++) {
//       const action = actions[i];
//       const type = action.actiontype;
//
//       switch (type) {
//         case 'init':
//           // const sendDatas = action.receivedData;
//           // this.onLoadData(sendDatas);
//           break;
//
//         case 'updateInfo':
//           break;
//
//         case 'login':
//           break;
//       }
//     }
//   }
//
//   fetchAllAppData(): void {
//     const lang = this.cookieService.get('Language');
//
//     const requests = [
//       {
//         name: 'getUserData',
//         data: {
//           frontend_post: 'getUserData',
//           langSyst: lang}
//       },
//       {
//         name: 'getMenu',
//         data: {
//           frontend_post: 'getMenu',
//           langSyst: lang}
//       },
//       {
//         name: 'getFavorites',
//         data: {
//           frontend_post: 'getFavorites',
//           langSyst: lang}
//       },
//       {
//         name: 'getInfo',
//         data: {
//           frontend_post: 'getInfo',
//           langSyst: lang}
//       }
//     ];
//
//     requests.forEach(req => {
//       this.onLoadData(req.data).subscribe(response => {
//         this.actionsStore(response); // Optional: to route through your existing logic
//       });
//     });
//   }
// }








import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private mainBase: string = "https://dev.tabus.net/";
  private redirectval_path = "main/html/handler.php";

  private http = inject(HttpClient);
  private cookieService = inject(CookieService);

  constructor() {}

  public onLoadData(sendDatas: any): Observable<any> {
    if (localStorage.getItem('token') !== null || localStorage.getItem('token') !== undefined) {
      sendDatas['token'] = localStorage.getItem('token');
      sendDatas['entity'] = localStorage.getItem('entity');
    } else {
      alert("missing token");
    }

    console.log('Sending to server: ');
    console.log(sendDatas);

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

  actionsStore(receivedData: any) {
    if (!receivedData || receivedData === 'error') {
      console.warn('Received invalid or error response:', receivedData);
      return;
    }

    const actions = receivedData.actions;
    if (!Array.isArray(actions)) {
      console.warn('No actions array found in response.');
      return;
    }

    for (let i = 0; i < actions.length; i++) {
      const action = actions[i];
      const type = action.actiontype;

      switch (type) {
        case 'init':
          break;

        case 'updateInfo':
          break;

        case 'login':
          break;

        case 'initialization': {
          const token = action['token'];
          const entity = action['entity'];

          localStorage.setItem('token', token);
          localStorage.setItem('entity', entity);

          this.onLoadData({
            frontend_post: 'getUserData',
            langSyst: this.cookieService.get('Language')
          }).subscribe(res => this.actionsStore(res));

          this.onLoadData({
            frontend_post: 'getMenu',
            langSyst: this.cookieService.get('Language')
          }).subscribe(res => this.actionsStore(res));

          this.onLoadData({
            frontend_post: 'getFavorites',
            langSyst: this.cookieService.get('Language')
          }).subscribe(res => this.actionsStore(res));

          this.onLoadData({
            frontend_post: 'getInfo',
            langSyst: this.cookieService.get('Language')
          }).subscribe(res => this.actionsStore(res));

          setTimeout(() => {
            const expiration = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days
            this.cookieService.set(
              'test_login',
              localStorage.getItem('userName') || '',
              expiration,
              '/'
            );
            (window as any).dialogService.shows = 'form';
            (window as any).overlayService.closeDialog('OverlayLoginComponent');
          }, 1000);

          break;
        }

        case 'updateUserData': {
          localStorage.setItem('userData', JSON.stringify(action['params']));
          break;
        }

        case 'updateMenu': {
          localStorage.setItem('menu', JSON.stringify(action['params']));
          console.log('Menu:', action['params']);
          break;
        }
      }
    }
  }

  fetchAllAppData(): void {
    const lang = this.cookieService.get('Language');

    const requests = [
      {
        name: 'getUserData',
        data: {
          frontend_post: 'getUserData',
          langSyst: lang
        }
      },
      {
        name: 'getMenu',
        data: {
          frontend_post: 'getMenu',
          langSyst: lang
        }
      },
      {
        name: 'getFavorites',
        data: {
          frontend_post: 'getFavorites',
          langSyst: lang
        }
      },
      {
        name: 'getInfo',
        data: {
          frontend_post: 'getInfo',
          langSyst: lang
        }
      }
    ];

    requests.forEach(req => {
      this.onLoadData(req.data).subscribe(response => {
        this.actionsStore(response);
      });
    });
  }
}







