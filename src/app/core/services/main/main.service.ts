import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {StoreService} from '../store/store.service';

@Injectable({
  providedIn: 'root'
})

export class MainService {
  private storeService = inject(StoreService);
  private formDataSubject = new BehaviorSubject<any>(null);
  private selectedEncrVarSubject = new BehaviorSubject<string | null>(null);
  selectedEncrVar$ = this.selectedEncrVarSubject.asObservable();

  constructor() {
  }

  // Call this when a menu item is clicked
  setSelectedEncrVar(encrVar: string) {
    this.selectedEncrVarSubject.next(encrVar);
  }

  fetchMenuItems(): Observable<any> {
    return this.storeService.onLoadData({frontend_post: 'getMenu'}).pipe(
      tap(res => console.log('Menu fetch:', res)),
      catchError(err => {
        console.error('Menu fetch error:', err);
        return of('error');
      })
    );
  }

  // fetchForm(payload: {
  //   frontend_post: string;
  //   encrVar: string;
  //   langSyst: string;
  //   parentIsModal: number;
  // }): Observable<any> {
  //   return this.storeService.onLoadData(payload).pipe(
  //     tap(res => console.log('Form fetch:', res)),
  //     catchError(err => {
  //       console.error('Form fetch error:', err);
  //       return of('error');
  //     })
  //   );
  // }

  fetchForm(payload: {
    frontend_post: string;
    encrVar: string;
    langSyst: string;
    parentIsModal: number;
  }): Observable<any> {
    return this.storeService.onLoadData(payload).pipe(
      tap(res => {
        console.log('📥 Form fetch response:', res);
        console.log('🔑 encrVar sent:', payload.encrVar);
      }),
      catchError(err => {
        console.error('❌ Form fetch error:', err);
        return of('error');
      })
    );
  }


  updateFormData(data: any): void {
    this.formDataSubject.next(data);
  }

  sendData(payload: any): void {
    this.storeService.onLoadData(payload).subscribe(response => {
      if (response !== 'error') {
        const getFormAction = response.actions?.find((a: any) => a.actiontype === 'getForm');
        const formParams = getFormAction?.params?.[0];
        if (formParams) {
          this.updateFormData(formParams);
        } else {
          console.warn('No usable form data');
        }
      }
    });
  }

  handleInit(data: any): void {
    console.log('Init logic not implemented:', data);
  }
}
