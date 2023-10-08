import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CustomerComponent } from './customer.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: CustomerComponent }
	])],
	exports: [RouterModule]
})
export class CustomerRoutingModule { }
