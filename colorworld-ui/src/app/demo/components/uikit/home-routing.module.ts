import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'products', data: { breadcrumb: 'Products' }, loadChildren: () => import('./product/product.module').then(m => m.ProductModule) },
        { path: 'customer', data: { breadcrumb: 'Customer' }, loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule) },
        { path: 'purchase', data: { breadcrumb: 'Purchase' }, loadChildren: () => import('./purchase/purchase.module').then(m => m.PurchaseModule) },
        { path: 'tax-invoice', data: { breadcrumb: 'Tax Invoice' }, loadChildren: () => import('./tax-invoice/tax-invoice.module').then(m => m.TaxInvoiceModule) },
        { path: 'invoice-history', data: { breadcrumb: 'Invoice History' }, loadChildren: () => import('./invoice-history/invoice-history.module').then(m => m.InvoiceHistoryModule) },
        { path: 'view-invoice/:bill', data: { breadcrumb: 'View Invoice' }, loadChildren: () => import('./view-invoice/view-invoice.module').then(m => m.ViewInvoiceModule) },
        { path: '**', redirectTo: '/home/tax-invoice', pathMatch: 'full' },
    ])],
    exports: [RouterModule]
})
export class HomeRoutingModule { }
