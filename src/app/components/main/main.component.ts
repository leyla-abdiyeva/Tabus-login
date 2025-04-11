import {Component, inject, OnInit} from '@angular/core';
import {AuthService} from '../../core/auth/auth.service';
import {HttpClient} from '@angular/common/http';
import {MainService} from '../../core/main/main.service';
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
  menuItems: any;


  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.mainService.fetchMenuItems().subscribe(
      (response) => {
        this.menuItems = response;
        console.log('Menu items fetched successfully', this.menuItems);
      },
      (error) => {
        console.error('Error fetching menu items:', error);
      }
    );
  }
}
