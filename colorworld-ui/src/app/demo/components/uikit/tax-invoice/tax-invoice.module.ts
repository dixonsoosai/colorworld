import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaxInvoiceComponent } from './tax-invoice.component';
import { TaxInvoiceRoutingModule } from './tax-invoice-routing.module';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CardModule } from 'primeng/card';
import { TabMenuModule } from 'primeng/tabmenu';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import {AutoCompleteModule} from 'primeng/autocomplete';
@NgModule({
	imports: [
		AutoCompleteModule,
		ButtonModule,
		CalendarModule,
		CardModule,
		CommonModule,
		ConfirmDialogModule,
		DialogModule,
		DropdownModule,
		FieldsetModule,
		FormsModule,
		InputNumberModule,
		InputTextModule,
		MultiSelectModule,
		RippleModule,
		TabMenuModule,
		TableModule,
		TaxInvoiceRoutingModule,
		ToastModule,
	],
	declarations: [TaxInvoiceComponent]
})
export class TaxInvoiceModule { }
