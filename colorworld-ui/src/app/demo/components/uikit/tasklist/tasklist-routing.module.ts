import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TasklistComponent } from './tasklist.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: TasklistComponent }
	])],
	exports: [RouterModule]
})
export class TaskListRoutingModule { }
