import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { PurchaseService } from 'src/app/demo/service/purchase.service';
import * as FileSaver from 'file-saver';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
    templateUrl: './purchase.component.html',
    providers: [MessageService, ConfirmationService, DialogService]
})
export class PurchaseComponent implements OnInit {

    purchaseDetails;
    loading = false;
    filteredData;
    position = "top";
    visible = false;

    @ViewChild('dt1') dt: Table;

    constructor(private purchaseService: PurchaseService) {

    }
    ngOnInit(): void {
        this.fetchAll();
    }

    fetchAll() {
        this.loading = true;
        this.purchaseService.fetchAll().subscribe(
            response => {
                response.data.forEach(item => item.ardate = new Date(item.ardate.substring(0,10)));
                this.purchaseDetails = response.data;
                this.loading = false;
            },
            error => {

            }
        );
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
            filteredData = this.purchaseDetails;
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

    addBill() {
        this.visible = true;
    }
}