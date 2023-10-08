import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductComponent } from './product.component';
import { ProductRoutingModule } from './product-routing.module';
import { InputNumberModule } from "primeng/inputnumber";
import { CascadeSelectModule } from "primeng/cascadeselect";
import { MultiSelectModule } from "primeng/multiselect";
import { InputTextModule } from "primeng/inputtext";
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FieldsetModule } from 'primeng/fieldset';
import { DialogModule } from 'primeng/dialog';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ProductRoutingModule,
		InputNumberModule,
		InputTextModule,
		CardModule,
		ToastModule,
		ConfirmDialogModule,
		FieldsetModule,
		DialogModule,
		MultiSelectModule
	],
	declarations: [ProductComponent]
})
export class ProductModule { }
