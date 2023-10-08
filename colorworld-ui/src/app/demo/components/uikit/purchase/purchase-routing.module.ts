import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PurchaseComponent } from './purchase.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: PurchaseComponent }
	])],
	exports: [RouterModule]
})
export class PurchaseRoutingModule { }
