import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductComponent } from './product.component';
import { ProductRoutingModule } from './product-routing.module';
import { InputNumberModule } from "primeng/inputnumber";
import { MultiSelectModule } from "primeng/multiselect";
import { InputTextModule } from "primeng/inputtext";
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FieldsetModule } from 'primeng/fieldset';
import { DialogModule } from 'primeng/dialog';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
	imports: [
		CardModule,
		CommonModule,
		ConfirmDialogModule,
		DialogModule,
		FieldsetModule,
		FormsModule,
		InputNumberModule,
		InputTextModule,
		MultiSelectModule,
		NgxSpinnerModule,
		ProductRoutingModule,
		ToastModule
	],
	declarations: [ProductComponent]
})
export class ProductModule { }
