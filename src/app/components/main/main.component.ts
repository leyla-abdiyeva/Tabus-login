import {AfterViewInit, Component, inject, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {AuthService} from '../../core/auth/auth.service';
import {MainService} from '../../core/services/main/main.service';
import {MenuComponent} from '../sidebar/menu/menu.component';
import {FormComponent} from '../form/form.component';

@Component({
  selector: 'app-main',
  imports: [
    MenuComponent
  ],
  templateUrl: './main.component.html',
  standalone: true,
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit, AfterViewInit{
  @ViewChild('dynamicContainer', { read: ViewContainerRef }) container!: ViewContainerRef;

  private mainService= inject(MainService);
  private authService= inject(AuthService);

  menuItems: any;


  ngOnInit() {
    this.triggerInit();
    this.loadData();
  }

  ngAfterViewInit() {
    this.mainService.selectedEncrVar$.subscribe(encrVar => {
      if (encrVar) {
        this.container.clear();
        const componentRef = this.container.createComponent(FormComponent);
        // Optionally pass the encrVar to FormComponent instance
        componentRef.instance.encrVar = encrVar;
      }
    });
  }

  loadData() {
    this.mainService.fetchMenuItems().subscribe(
      (response) => {
        this.menuItems = response;
        console.log('Menu items fetched successfully', response);
      },
      (error) => {
        console.error('Error fetching menu items:', error);
      }
    );
  }

  private triggerInit(): void {
    const data = {
      actions: [
        {
          actiontype: 'init',
          receivedData: {
            frontend_post: 'init'
          }
        }
      ],
      console: '',
      errors: ''
    };

    // Here, you can either directly call a handler or pass it to your service
    // For now, we'll just log or pass it to MainService if needed
    console.log('Triggering init action:', data);

    // Optionally send it to mainService if you want to forward it
    this.mainService.handleInit(data);
  }



}
