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
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
	imports: [
		ButtonModule,
		CardModule,
		CommonModule,
		ConfirmDialogModule,
		CustomerRoutingModule,
		FormsModule,
		InputNumberModule,
		InputTextModule,
		InputTextareaModule,
		NgxSpinnerModule,
		ToastModule,
		TooltipModule
	],
	declarations: [CustomerComponent]
})
export class CustomerModule { }
