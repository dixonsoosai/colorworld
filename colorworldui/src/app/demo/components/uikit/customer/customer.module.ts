import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerComponent } from './customer.component';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';

@NgModule({
	imports: [
		CommonModule,
		CustomerRoutingModule,
		FormsModule,
		ButtonModule,
		RippleModule,
		SplitButtonModule,
		ToggleButtonModule,
		ToastModule,
		ConfirmDialogModule,
		InputTextModule,
		CardModule
	],
	declarations: [CustomerComponent]
})
export class ButtonDemoModule { }
