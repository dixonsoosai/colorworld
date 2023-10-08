import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PurchaseComponent } from './purchase.component';
import { PurchaseRoutingModule } from './purchase-routing.module';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { FieldsetModule } from 'primeng/fieldset';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';


@NgModule({
	imports: [
		CommonModule,
		PurchaseRoutingModule,
		FormsModule,
		TableModule,
		ButtonModule,
		InputTextModule,
		RippleModule,
		FieldsetModule,
		TooltipModule,
		CardModule,
		ToastModule,
		InputNumberModule,
		ConfirmDialogModule,
		DialogModule,
		ToastModule,
		CalendarModule
	],
	declarations: [PurchaseComponent]
})
export class PurchaseModule { }
