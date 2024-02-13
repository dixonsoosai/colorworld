import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { InvoiceHistoryRoutingModule } from './invoice-history-routing.module';
import { InvoiceHistoryComponent } from './invoice-history.component';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { CalendarModule } from 'primeng/calendar';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TabMenuModule } from 'primeng/tabmenu';
import { InvoiceTableModule } from '../invoice-table/invoice-table.module';

@NgModule({
  declarations: [InvoiceHistoryComponent],
  imports: [
	ButtonModule,
	CalendarModule,
	CardModule,
	CommonModule,
	ConfirmDialogModule,
	FormsModule,
	InputTextModule,
	InvoiceTableModule,
	InvoiceHistoryRoutingModule,
	NgxSpinnerModule,
	RippleModule,
	TabMenuModule,
	TableModule,
	ToastModule,
	TooltipModule,
  ]
})
export class InvoiceHistoryModule { }
