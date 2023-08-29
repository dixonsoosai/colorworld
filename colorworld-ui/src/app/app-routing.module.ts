import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductsComponent } from './products/products.component';
import { CustomersComponent } from './customers/customers.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TaxInvoiceComponent } from './billing/tax-invoice/tax-invoice.component';
import { InvoiceHistoryComponent } from './billing/invoice-history/invoice-history.component';
import { AccountsComponent } from './billing/accounts/accounts.component';

const routes: Routes = [
    { path: 'home', component: HomeComponent, 
      children: [
        { path: 'dashboard', component: DashboardComponent},
        { path: 'tax-invoice', component: TaxInvoiceComponent},
        { path: 'invoice-history', component: InvoiceHistoryComponent},
        { path: 'accounts', component: AccountsComponent},
        { path: 'accounts-history', component: InvoiceHistoryComponent},
        { path: 'products', component: ProductsComponent},
        { path: 'customers', component: CustomersComponent},
      ]
  },
    
  ];
  
  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }