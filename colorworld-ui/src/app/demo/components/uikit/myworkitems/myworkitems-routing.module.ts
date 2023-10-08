import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MyWorkItemsComponent } from './myworkitems.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: MyWorkItemsComponent }
	])],
	exports: [RouterModule]
})
export class MyWorkItemsRoutingModule { }
