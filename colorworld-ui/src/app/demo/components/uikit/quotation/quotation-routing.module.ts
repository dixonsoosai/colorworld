import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { QuotationComponent } from './quotation.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: QuotationComponent }
	])],
	exports: [RouterModule]
})
export class QuotationRoutingModule { }
