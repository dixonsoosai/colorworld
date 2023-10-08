import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InvoiceHistoryComponent } from './invoice-history.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: InvoiceHistoryComponent }
	])],
	exports: [RouterModule]
})
export class InvoiceHistoryRoutingModule { }
