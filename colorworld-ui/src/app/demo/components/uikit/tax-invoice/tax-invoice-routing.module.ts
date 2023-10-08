import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TaxInvoiceComponent } from './tax-invoice.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: TaxInvoiceComponent }
	])],
	exports: [RouterModule]
})
export class TaxInvoiceRoutingModule { }
