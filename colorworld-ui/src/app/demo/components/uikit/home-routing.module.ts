import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'products', data: { breadcrumb: 'Products' }, loadChildren: () => import('./product/product.module').then(m => m.ProductModule) },
        { path: 'customer', data: { breadcrumb: 'Customer' }, loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule) },
        { path: 'purchase', data: { breadcrumb: 'Purchase' }, loadChildren: () => import('./purchase/purchase.module').then(m => m.PurchaseModule) },
        { path: 'quotation', data: { breadcrumb: 'Quotation' }, loadChildren: () => import('./quotation/quotation.module').then(m => m.QuotationModule) },
        { path: 'quotation/:bill', data: { breadcrumb: 'Quotation' }, loadChildren: () => import('./quotation/quotation.module').then(m => m.QuotationModule) },
        { path: 'proforma-invoice', data: { breadcrumb: 'Proforma Invoice' }, loadChildren: () => import('./proforma-invoice/proforma-invoice.module').then(m => m.ProformaInvoiceModule) },
        { path: 'proforma-invoice/:bill', data: { breadcrumb: 'Proforma Invoice' }, loadChildren: () => import('./proforma-invoice/proforma-invoice.module').then(m => m.ProformaInvoiceModule) },
        { path: 'tax-invoice', data: { breadcrumb: 'Tax Invoice' }, loadChildren: () => import('./tax-invoice/tax-invoice.module').then(m => m.TaxInvoiceModule) },
        { path: 'tax-invoice/:bill', data: { breadcrumb: 'Tax Invoice' }, loadChildren: () => import('./tax-invoice/tax-invoice.module').then(m => m.TaxInvoiceModule) },
        { path: 'invoice-history', data: { breadcrumb: 'Invoice History' }, loadChildren: () => import('./invoice-history/invoice-history.module').then(m => m.InvoiceHistoryModule) },
        { path: '**', redirectTo: '/home/tax-invoice', pathMatch: 'full' },
    ])],
    exports: [RouterModule]
})
export class HomeRoutingModule { }
