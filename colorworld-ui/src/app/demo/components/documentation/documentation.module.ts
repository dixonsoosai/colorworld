import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentationRoutingModule } from './documentation-routing.module';
import { DocumentationComponent } from './documentation.component';
import { TableModule } from 'primeng/table';

@NgModule({
    imports: [
        CommonModule,
        DocumentationRoutingModule,
        TableModule
    ],
    declarations: [DocumentationComponent]
})
export class DocumentationModule { }
