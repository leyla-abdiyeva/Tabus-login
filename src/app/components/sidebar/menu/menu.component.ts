// import { Component, OnInit, inject } from '@angular/core';
// import { MainService } from '../../../core/main/main.service';
// import { NgForOf, NgIf, NgTemplateOutlet } from '@angular/common';
// import { MatSidenavModule } from '@angular/material/sidenav';
// import { MatExpansionModule } from '@angular/material/expansion';
// import { CookieService } from 'ngx-cookie-service';
//
// export interface MenuNode {
//   name: string;
//   modNumber: string;
//   icon: string;
//   iconLink: string;
//   encrvar: string;
//   children?: MenuNode[];
// }
//
// @Component({
//   selector: 'app-menu',
//   standalone: true,
//   imports: [
//     MatSidenavModule,
//     NgForOf,
//     NgIf,
//     MatExpansionModule,
//     NgTemplateOutlet,
//   ],
//   templateUrl: './menu.component.html',
//   styleUrl: './menu.component.css',
// })
// export class MenuComponent implements OnInit {
//   menuTree: MenuNode[] = [];
//   selectedNode: MenuNode | null = null;
//   expandedPath: string[] = [];
//
//   private mainService = inject(MainService);
//   private cookieService = inject(CookieService);
//
//   ngOnInit(): void {
//     this.loadMenu();
//   }
//
//   loadMenu(): void {
//     this.mainService.fetchMenuItems().subscribe(response => {
//       const updateMenuAction = response.actions?.find(
//         (action: { actiontype: string }) => action.actiontype === 'updateMenu'
//       );
//       if (updateMenuAction?.params) {
//         this.menuTree = updateMenuAction.params;
//       }
//     });
//   }
//
//   hasChildren(node: MenuNode): boolean {
//     return Array.isArray(node.children) && node.children.length > 0;
//   }
//
//   onItemClick(node: MenuNode, level: number): void {
//     if (this.hasChildren(node)) {
//       if (this.expandedPath[level] === node.encrvar) {
//         // collapse this level and deeper
//         this.expandedPath = this.expandedPath.slice(0, level);
//       } else {
//         // expand this node at current level, and remove deeper levels
//         this.expandedPath = this.expandedPath.slice(0, level);
//         this.expandedPath[level] = node.encrvar;
//       }
//     } else {
//       this.selectedNode = node;
//       sessionStorage.setItem('activeNode', JSON.stringify(node));
//       this.updateExpandedNodes();
//
//       const datas = {
//         frontend_post: 'getForm',
//         encrVar: node.encrvar,
//         langSyst: this.cookieService.get('Language'),
//       };
//
//       const data = {
//         actions: [
//           {
//             actiontype: 'getForm',
//             receivedData: datas,
//           },
//         ],
//       };
//
//       this.mainService.sendData(data);
//     }
//   }
//
//   updateExpandedNodes(): void {
//     sessionStorage.setItem('expandedPath', JSON.stringify(this.expandedPath));
//   }
//
//   isExpanded(node: MenuNode, level: number): boolean {
//     return this.expandedPath[level] === node.encrvar;
//   }
//
//   trackByFn(index: number, item: MenuNode): string {
//     return item.modNumber;
//   }
// }


import {Component, OnInit, inject} from '@angular/core';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource, MatTreeModule} from '@angular/material/tree';
import {MainService} from '../../../core/main/main.service';
import {CookieService} from 'ngx-cookie-service';
import {MatSidenavContainer, MatSidenavModule} from '@angular/material/sidenav';
import {NgForOf, NgIf} from '@angular/common';

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
    NgForOf
  ]
})
export class MenuComponent implements OnInit {
  treeControl = new NestedTreeControl<MenuNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<MenuNode>();

  selectedNode: MenuNode | null = null;
  menuLoaded = false;

  private mainService = inject(MainService);
  private cookieService = inject(CookieService);

  ngOnInit(): void {
    this.loadMenu();
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
}
