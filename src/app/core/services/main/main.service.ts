import {inject, Injectable} from '@angular/core';
import {Observable, of, Subject, tap} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {StoreService} from '../store/store.service';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  private storeService = inject(StoreService);
  private formDataSubject = new Subject<any>();
  formData$ = this.formDataSubject.asObservable();

  constructor() {}

  // Function to fetch data from backend PHP
  fetchMenuItems(): Observable<any> {
    const requests = {
      frontend_post: 'getMenu'
    };

    return this.storeService.onLoadData(requests).pipe(
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

  updateFormData(data: any): void {
    this.formDataSubject.next(data);
  }

  sendData(data: any): void {
    this.storeService.onLoadData(data).subscribe(response => {
      if (response !== 'error') {
        const getFormAction = response.actions?.find((a: any) => a.actiontype === 'getForm');

        if (getFormAction) {
          const formParams = response.params?.[0];
          if (formParams) {
            this.updateFormData(formParams); // ✅ send usable form config to FormComponent
          } else {
            console.warn('No form parameters found in response');
          }
        } else {
          console.warn('No getForm action in response');
        }
      }
    });
  }


}
