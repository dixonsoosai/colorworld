import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { InvoiceTableComponent } from './invoice-table.component';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { CalendarModule } from 'primeng/calendar';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TabMenuModule } from 'primeng/tabmenu';
import { RadioButtonModule } from 'primeng/radiobutton';

@NgModule({
  declarations: [InvoiceTableComponent],
  imports: [
	ButtonModule,
	CalendarModule,
	CardModule,
	CommonModule,
	ConfirmDialogModule,
	FormsModule,
	InputTextModule,
	NgxSpinnerModule,
	RippleModule,
	TabMenuModule,
	TableModule,
	ToastModule,
	TooltipModule,
  ],
  exports:[InvoiceTableComponent]
})
export class InvoiceTableModule { }
