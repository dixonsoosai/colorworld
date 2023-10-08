import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerComponent } from './customer.component';
import { CustomerRoutingModule } from './customer-routing.module';
import { InputTextareaModule } from "primeng/inputtextarea";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CardModule } from 'primeng/card';
import { InputNumberModule } from 'primeng/inputnumber';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		CustomerRoutingModule,
		InputTextareaModule,
		InputTextModule,
		InputNumberModule,
		ButtonModule,
		ToastModule,
		ConfirmDialogModule,
		CardModule,
		TooltipModule
	],
	declarations: [CustomerComponent]
})
export class CustomerModule { }
