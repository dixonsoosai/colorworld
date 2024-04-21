import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormulaConverterComponent } from './formula-converter.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: FormulaConverterComponent }
	])],
	exports: [RouterModule]
})
export class FormulaConverterRoutingModule { }
