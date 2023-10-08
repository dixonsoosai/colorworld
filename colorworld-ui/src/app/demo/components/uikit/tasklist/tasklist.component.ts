import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Customer, Representative } from 'src/app/demo/api/customer';
import { CustomerService } from 'src/app/demo/service/customer.service';
import { Product } from 'src/app/demo/api/product';
import { ProductService } from 'src/app/demo/service/product.service';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import * as FileSaver from 'file-saver';
import { InvoiceService } from 'src/app/demo/service/invoice.service';

interface expandedRows {
    [key: string]: boolean;
}

@Component({
  templateUrl: './tasklist.component.html',
  styleUrls: ['./tasklist.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class TasklistComponent {

    invoiceDetails;
    loading = false;
    filteredData;
    position = "top";
    visible = false;

    constructor(private invoiceService: InvoiceService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
        ) { }

    ngOnInit() {
        this.fetchAll();
    }

    fetchAll() {
        this.loading = true;
        this.invoiceService.fetchAll().subscribe(response => {
            this.invoiceDetails = response.data;
            this.loading = false;
        }, 
        error => {

        })
    }
  
    clear(table: Table) {
        table.clear();
    }

    exportFilteredData(dataTable: Table): void {
        this.filteredData = dataTable.filteredValue;
    }

    exportExcel(dataTable: Table) {
        let filteredData = [];
        if(dataTable.filteredValue == null) {
            filteredData = this.invoiceDetails;
        }
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(filteredData);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['Purchase History'] };
            const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            this.saveAsExcelFile(excelBuffer, 'Purchase History');
        });
    }

    saveAsExcelFile(buffer: any, fileName: string): void {
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName + new Date().getTime() + EXCEL_EXTENSION);
    }
    
    
}
