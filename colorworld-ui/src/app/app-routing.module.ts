import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableCellEditDemo } from './demo/table-cell-edit-demo';
import { SidebarComponent } from './sidebar/sidebar.component';

const routes: Routes = [
    { path: 'table', component: TableCellEditDemo },
    { path: 'sidebar', component: SidebarComponent }
  ];
  
  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }