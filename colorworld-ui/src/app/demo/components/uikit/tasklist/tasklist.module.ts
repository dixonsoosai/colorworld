import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { RippleModule } from 'primeng/ripple';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { SliderModule } from 'primeng/slider';
import { RatingModule } from 'primeng/rating';
import { TaskListRoutingModule } from './tasklist-routing.module';
import { TasklistComponent } from './tasklist.component';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';


@NgModule({
  declarations: [TasklistComponent],
  imports: [
    	CommonModule,
		TaskListRoutingModule,
		FormsModule,
		TableModule,
		RatingModule,
		ButtonModule,
		RippleModule,
		CardModule,
		ToastModule,
		ConfirmDialogModule,
		InputTextModule
  ]
})
export class TasklistModule { }
