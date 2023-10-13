import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService, ConfirmationService, FilterService } from 'primeng/api';
import { Table } from 'primeng/table';
import { PurchaseService } from 'src/app/demo/service/purchase.service';
import * as FileSaver from 'file-saver';
import { DialogService } from 'primeng/dynamicdialog';
import { PurchaseBill } from 'src/app/demo/domain/purchase';
import { errorToastr, getLastDay, successToastr } from 'src/app/demo/service/apputils.service';

@Component({
    templateUrl: './purchase.component.html',
    providers: [MessageService, ConfirmationService, DialogService]
})
export class PurchaseComponent implements OnInit {

    purchaseDetails;
    loading = false;
    filteredData;
    visible = false;
    purchaseBill : PurchaseBill = new PurchaseBill(); 
    filterDate;

    @ViewChild('dt1') dt: Table;

    constructor(
        private purchaseService: PurchaseService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private filterService: FilterService
        ) {

    }
    ngOnInit(): void {
        this.fetchAll();
    }

    
    filterPurchase() {
        let startDate = new Date(this.filterDate);
        let endDate = getLastDay(startDate);
        const dateRange = [startDate, endDate];
        this.dt.filter(startDate, 'ardate', 'gte');
        //this.dt.filter(endDate, 'ardate', 'lte');
    }
    fetchAll() {
        this.loading = true;
        this.purchaseService.fetchAll().subscribe({
            next: response => {
                response.data.forEach(item => {
                    if(item != null) {
                        item.ardate = item.ardate == null ? "" : new Date(item.ardate.substring(0,10));
                    }
                });
                this.purchaseDetails = response.data;
                this.loading = false;
            },
            error: error => {

            },
            complete: () => {
                this.loading = false;
            }
        }
        );
    }

    clearFilter(table: Table) {
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

    save() {
        let errorFlag = false;
        if(this.purchaseBill.arbillno == "") {
            this.messageService.add(errorToastr("Invoice Number cannot be blank"));
            errorFlag = true;
        }
        if(this.purchaseBill.arname == "") {
            this.messageService.add(errorToastr("Company Name cannot be blank"));
            errorFlag = true;
        }
        if(this.purchaseBill.ardate == "") {
            this.messageService.add(errorToastr("Invoice Date cannot be blank"));
            errorFlag = true;
        }
        if(this.purchaseBill.arnamt == 0) {
            this.messageService.add(errorToastr("Net Amount cannot be blank"));
            errorFlag = true;
        }
        if(this.purchaseBill.arcgst == 0) {
            this.messageService.add(errorToastr("CGST cannot be blank"));
            errorFlag = true;
        }

        if(this.purchaseBill.arsgst == 0) {
            this.messageService.add(errorToastr("SGST cannot be blank"));
            errorFlag = true;
        }
        if(this.purchaseBill.artamt == 0) {
            this.messageService.add(errorToastr("Total Amount cannot be blank"));
            errorFlag = true;
        }

        if(this.purchaseBill.archqamt != 0 || this.purchaseBill.archqdte != "" || this.purchaseBill.archqno != 0 ||
            this.purchaseBill.arbname != "") {
                if(this.purchaseBill.archqamt == 0) {
                    this.messageService.add(errorToastr("Cheque Amount cannot be blank"));
                    errorFlag = true;
                }
                if(this.purchaseBill.archqdte == "") {
                    this.messageService.add(errorToastr("Cheque Date cannot be blank"));
                    errorFlag = true;
                }
                if(this.purchaseBill.archqno == 0) {
                    this.messageService.add(errorToastr("Cheque Number cannot be blank"));
                    errorFlag = true;
                }
            }


        if(errorFlag) {
            return;
        }

        this.purchaseService.save(this.purchaseBill).subscribe({
            next: response => {
                if(response.code == 200) {
                    this.clear();
                    this.messageService.add(successToastr("Bill saved successfully"));
                }
            },
            error: err => {
                this.messageService.add(errorToastr("Error while saving Bill. Kindly contact system administrator"));
                console.error(err);
            },
            complete: () => {}
        }
            
        );
    }
    clear() {
        this.purchaseBill = new PurchaseBill();
        this.visible = false;
    }

    view(purchaseBill : PurchaseBill) {
        this.purchaseBill = purchaseBill;
        this.visible = true;
    }

    delete(purchaseBill: PurchaseBill) {
        this.confirmationService.confirm({
            message: `Are you sure that you want to delete? <br> Invoice: ${purchaseBill.arbillno}<br> Company Name: ${purchaseBill.arname}` ,
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.purchaseService.delete(purchaseBill.arbillno, purchaseBill.arname).subscribe({
                    next: response => {
                        if(response["status"] == 200) {
                            this.messageService.add(successToastr("Invoice deleted successfully"));
                        }
                        else {
                            this.messageService.add(errorToastr("Error deleting Invoice"));
                            console.error(response);
                        }
                        window.location.reload();
                    },
                    error: error => {
                        this.messageService.add(errorToastr("Error deleting Invoice"));
                        console.error(error);
                    },
                    complete:() => {}

                });
            }
        });
    }

    calculate(column: string) {
        switch(column) {
            case "arnamt":
                this.purchaseBill.arcgst = this.purchaseBill.arsgst = parseFloat((this.purchaseBill.arnamt * 0.09).toFixed(2));
                this.purchaseBill.artamt = this.purchaseBill.arnamt + this.purchaseBill.arcgst + this.purchaseBill.arsgst;
                break;
            case "arcgst":
                this.purchaseBill.arsgst = this.purchaseBill.arcgst;
                this.purchaseBill.artamt = this.purchaseBill.arnamt + this.purchaseBill.arcgst + this.purchaseBill.arsgst;
                break;
            case "arsgst":
                this.purchaseBill.arcgst = this.purchaseBill.arsgst;
                this.purchaseBill.artamt = this.purchaseBill.arnamt + this.purchaseBill.arcgst + this.purchaseBill.arsgst;
                break;
            case "artamt":
                this.purchaseBill.arnamt = parseFloat((this.purchaseBill.artamt/(1.18)).toFixed(2));
                this.purchaseBill.arcgst = this.purchaseBill.arsgst = parseFloat((this.purchaseBill.arnamt * 0.09).toFixed(2));
                this.purchaseBill.arnamt = parseFloat((this.purchaseBill.artamt - 
                    this.purchaseBill.arcgst - this.purchaseBill.arsgst).toFixed(2));
                break;
        }
    }
}