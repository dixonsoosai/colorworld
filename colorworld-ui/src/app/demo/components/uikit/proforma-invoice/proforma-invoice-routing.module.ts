import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProformaInvoiceComponent } from './proforma-invoice.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ProformaInvoiceComponent }
	])],
	exports: [RouterModule]
})
export class ProformaInvoiceRoutingModule { }
