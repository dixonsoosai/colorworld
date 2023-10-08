import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'floatlabel', data: { breadcrumb: 'Float Label' }, loadChildren: () => import('./floatlabel/floatlabeldemo.module').then(m => m.FloatlabelDemoModule) },
        { path: 'formlayout', data: { breadcrumb: 'Form Layout' }, loadChildren: () => import('./product/product.module').then(m => m.ProductModule) },
        { path: 'input', data: { breadcrumb: 'Customer' }, loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule) },
        { path: 'invalidstate', data: { breadcrumb: 'Invalid State' }, loadChildren: () => import('./invalid/invalidstatedemo.module').then(m => m.InvalidStateDemoModule) },
        { path: 'list', data: { breadcrumb: 'List' }, loadChildren: () => import('./list/listdemo.module').then(m => m.ListDemoModule) },
        { path: 'message', data: { breadcrumb: 'Message' }, loadChildren: () => import('./messages/messagesdemo.module').then(m => m.MessagesDemoModule) },
        { path: 'table', data: { breadcrumb: 'Table' }, loadChildren: () => import('./purchase/purchase.module').then(m => m.PurchaseModule) },
        { path: 'myworkitems', data: { breadcrumb: 'My Work Items' }, loadChildren: () => import('./myworkitems/myworkitems.module').then(m => m.MyWorkItemsModule) },
        { path: 'tasklist', data: { breadcrumb: 'Task List' }, loadChildren: () => import('./tasklist/tasklist.module').then(m => m.TasklistModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class UIkitRoutingModule { }
