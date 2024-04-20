import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormulaRoutingModule } from './formula-routing.module';
import { FormulaComponent } from './formula.component';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';

@NgModule({
  declarations: [FormulaComponent],
  imports: [
	ButtonModule,
	CardModule,
	CommonModule,
	ConfirmDialogModule,
	DialogModule,
	FormsModule,
	InputTextModule,
	InputNumberModule,
	FormulaRoutingModule,
	NgxSpinnerModule,
	RippleModule,
	TableModule,
	ToastModule,
	TooltipModule,
  ]
})
export class FormulaModule { }
