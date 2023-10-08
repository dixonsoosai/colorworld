import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TaxInvoiceComponent } from './listdemo.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: TaxInvoiceComponent }
	])],
	exports: [RouterModule]
})
export class ListDemoRoutingModule { }
