import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor() {}

  handleShowForm(params: any): void {
    console.log('Handling showForm:', params);
    // TODO: Notify component or update a BehaviorSubject to render the form
  }

  handleUpdateForm(params: any): void {
    console.log('Handling updateForm:', params);
    // TODO: Update form data in shared state
  }
}
