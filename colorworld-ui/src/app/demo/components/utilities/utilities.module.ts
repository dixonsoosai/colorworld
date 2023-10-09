import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilitiesRoutingModule } from './utilities-routing.module';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
    imports: [
        CommonModule,
        UtilitiesRoutingModule,
        InputTextModule
    ],
    declarations: []
})
export class UtilitiesModule { }
