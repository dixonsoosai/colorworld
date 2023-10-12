import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ViewInvoiceComponent } from './view-invoice.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ViewInvoiceComponent }
	])],
	exports: [RouterModule]
})
export class ViewInvoiceRoutingModule { }
