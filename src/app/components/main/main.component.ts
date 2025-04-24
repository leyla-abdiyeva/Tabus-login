import {Component, inject, OnInit} from '@angular/core';
import {AuthService} from '../../core/auth/auth.service';
import {HttpClient} from '@angular/common/http';
import {MainService} from '../../core/services/main/main.service';
import {MenuComponent} from '../sidebar/menu/menu.component';

@Component({
  selector: 'app-main',
  imports: [
    MenuComponent
  ],
  templateUrl: './main.component.html',
  standalone: true,
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit{
  private mainService= inject(MainService);
  private authService= inject(AuthService);

  menuItems: any;


  ngOnInit() {
    this.triggerInit();
    this.loadData();
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
