import {inject, Injectable} from '@angular/core';
import {Observable, of, Subject, tap} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {StoreService} from '../store/store.service';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  private storeService = inject(StoreService);

  constructor() {}

  // Function to fetch data from backend PHP
  fetchMenuItems(): Observable<any> {
    const sendDatas = {
      frontend_post: 'getMenu'
    };

    return this.storeService.onLoadData(sendDatas).pipe(
      tap(response => {
        if (response !== 'error') {
          console.log('Login successful!', response, );
        } else {
          console.log('Login failed');
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        return of('error');
      })
    );
  }

  private dataSubject = new Subject<any>();
  sendData(data: any) {
    this.dataSubject.next(data);
  }
  getDataObservable(): Observable<any> {
    return this.dataSubject.asObservable();
  }

}
