import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormulaComponent } from './formula.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: FormulaComponent }
	])],
	exports: [RouterModule]
})
export class FormulaRoutingModule { }
