import {Component, OnInit, inject} from '@angular/core';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource, MatTreeModule} from '@angular/material/tree';
import {MainService} from '../../../core/services/main/main.service';
import {CookieService} from 'ngx-cookie-service';
import {MatSidenavContainer, MatSidenavModule} from '@angular/material/sidenav';
import {KeyValuePipe, NgForOf, NgIf} from '@angular/common';
import {StoreService} from '../../../core/services/store/store.service';

export interface MenuNode {
  name: string;
  modNumber: string;
  icon: string;
  iconLink: string;
  encrvar: string;
  children?: MenuNode[];
}

@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
  imports: [
    MatTreeModule,
    MatSidenavContainer,
    MatSidenavModule,
    MatTreeModule,
    NgIf,
    NgForOf,
    KeyValuePipe
  ]
})
export class MenuComponent implements OnInit {
  treeControl = new NestedTreeControl<MenuNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<MenuNode>();

  selectedNode: MenuNode | null = null;
  menuLoaded = false;
  menuExpanded = true;
  formData: any = null; // Store form data here
  infoData: any = null;
  infoExpanded = false; // controls toggle for System Info
  favoritesData: any[] = [];
  favoritesExpanded = false;

  private mainService = inject(MainService);
  private cookieService = inject(CookieService);
  private storeService = inject(StoreService);

  ngOnInit(): void {
    this.loadMenu();
    this.loadFormData();
    this.loadInfoData();
    this.loadFavoritesData()
    this.storeService.fetchAllAppData();
    this.restoreSelectedNode();
  }

  loadMenu(): void {
    this.mainService.fetchMenuItems().subscribe(response => {
      const updateMenuAction = response.actions?.find(
        (action: { actiontype: string }) => action.actiontype === 'updateMenu'
      );
      if (updateMenuAction?.params) {
        this.dataSource.data = [...updateMenuAction.params]; // clone to trigger change detection
        this.menuLoaded = true;
      }
    });
  }

  loadFormData(): void {
    this.mainService.formData$.subscribe(data => {
      console.log('Form Data received:', data);
      this.formData = data;
    });
  }

  loadInfoData(): void {
    const lang = this.cookieService.get('Language');
    const data = {
      frontend_post: 'getInfo',
      langSyst: lang
    };

    this.storeService.onLoadData(data).subscribe(response => {
      const infoAction = response.actions?.find((a: any) => a.actiontype === 'updateInfo');
      if (infoAction?.params) {
        this.infoData = infoAction.params;
        console.log('ℹ️ Info data loaded:', this.infoData);
      }
    });
  }

  loadFavoritesData(): void {
    const lang = this.cookieService.get('Language');
    const data = {
      frontend_post: 'getFavorites',
      langSyst: lang
    };

    this.storeService.onLoadData(data).subscribe(response => {
      const favAction = response.actions?.find((a: any) => a.actiontype === 'updateFavorites');
      if (favAction?.params) {
        this.favoritesData = favAction.params;
        console.log('⭐ Favorites data loaded:', this.favoritesData);
      }
    });
  }


  hasChild = (_: number, node: MenuNode) =>
    !!node.children && node.children.length > 0;

  onItemClick(node: MenuNode): void {
    if (!this.hasChild(0, node)) {
      this.selectedNode = node;
      sessionStorage.setItem('activeNode', JSON.stringify(node));

      const datas = {
        frontend_post: 'getForm',
        encrVar: node.encrvar,
        langSyst: this.cookieService.get('Language'),
      };

      const data = {
        actions: [
          {
            actiontype: 'getForm',
            receivedData: datas,
          },
        ],
      };

      this.mainService.sendData(data);
    } else {
      this.treeControl.isExpanded(node)
        ? this.treeControl.collapse(node)
        : this.treeControl.expand(node);
    }
  }

  restoreSelectedNode(): void {
    const storedNode = sessionStorage.getItem('activeNode');
    if (storedNode) {
      try {
        this.selectedNode = JSON.parse(storedNode);
        // Optional: re-fetch the form
        this.mainService.sendData({
          actions: [
            {
              actiontype: 'getForm',
              receivedData: {
                frontend_post: 'getForm',
                encrVar: this.selectedNode?.encrvar,
                langSyst: this.cookieService.get('Language'),
              }
            }
          ]
        });
      } catch (e) {
        console.warn('Failed to parse stored node:', e);
      }
    }
  }

}
